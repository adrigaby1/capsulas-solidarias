import { v4 as uuidv4 } from "uuid";
import { getSupabaseServiceClient, RESULTS_BUCKET } from "@/lib/supabase/server";
import { buildCapsulePrompt } from "@/lib/prompt-builder";
import { generateCapsuleImage } from "@/lib/image-generation";
import { normalizeReferenceImage } from "@/lib/normalize-image";
import type { CapsuleFormData } from "@/lib/types";

/**
 * Orquesta todo el pipeline de generación para una submission ya creada:
 * 1. Marca el estado como "generating".
 * 2. Construye el prompt maestro a partir del formulario.
 * 3. Descarga la foto original y la envía al proveedor de IA.
 * 4. Sube la imagen resultante y marca la submission como "ready".
 *
 * Cualquier fallo deja la submission en estado "error" con un mensaje
 * legible para poder mostrarlo en la UI y permitir reintentar.
 */
export async function runImageGeneration(submissionId: string) {
  const supabase = getSupabaseServiceClient();

  const { data: submission, error } = await supabase
    .from("submissions")
    .select("id, photo_url, form_data")
    .eq("id", submissionId)
    .single();

  if (error || !submission) {
    throw new Error(`No se encontró la submission ${submissionId}`);
  }

  await supabase.from("submissions").update({ status: "generating" }).eq("id", submissionId);

  try {
    const prompt = buildCapsulePrompt(submission.form_data as CapsuleFormData);

    const photoResponse = await fetch(submission.photo_url);
    if (!photoResponse.ok) {
      throw new Error("No se ha podido descargar la fotografía original.");
    }
    const rawBuffer = Buffer.from(await photoResponse.arrayBuffer());

    // Normalizamos siempre a un PNG "limpio" (sRGB, sin alfa, orientado)
    // antes de mandarlo a OpenAI: algunas fotos de iPhone (HEIC reales o con
    // perfiles de color no estándar) provocan un error invalid_image_file
    // si se envían tal cual.
    const normalized = await normalizeReferenceImage(
      rawBuffer,
      photoResponse.headers.get("content-type") ?? undefined
    );
    // Uint8Array.from() copia a un ArrayBuffer "normal" (no
    // ArrayBufferLike/SharedArrayBuffer), que es el tipo que exige BlobPart
    // en TypeScript — Buffer no es directamente asignable ahí.
    const referenceImage = new Blob([Uint8Array.from(normalized.buffer)], {
      type: normalized.contentType,
    });

    const { imageBuffer, contentType } = await generateCapsuleImage({
      prompt,
      referenceImage,
      referenceImageName: normalized.filename,
    });

    const resultPath = `${submissionId}/${uuidv4()}.png`;
    const { error: uploadError } = await supabase.storage
      .from(RESULTS_BUCKET)
      .upload(resultPath, imageBuffer, { contentType, upsert: true });

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from(RESULTS_BUCKET).getPublicUrl(resultPath);

    await supabase
      .from("submissions")
      .update({
        status: "ready",
        image_url: publicUrlData.publicUrl,
        prompt,
      })
      .eq("id", submissionId);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido generando la imagen.";
    await supabase
      .from("submissions")
      .update({ status: "error", error_message: message })
      .eq("id", submissionId);
    throw err;
  }
}
