/**
 * Capa de abstracción sobre el proveedor de generación de imágenes por IA.
 *
 * Por defecto usa la API de imágenes de OpenAI (gpt-image-1) con la
 * fotografía del usuario como referencia (endpoint "images/edits") para
 * maximizar el parecido facial. Si en el futuro se quiere usar otro
 * proveedor (Midjourney vía API no oficial, Stability, Replicate, etc.)
 * basta con implementar la misma función `generateCapsuleImage` y
 * sustituir la importación en /api/generate-image.
 */

export interface GenerateCapsuleImageParams {
  prompt: string;
  referenceImage: Blob;
  referenceImageName?: string;
}

export interface GenerateCapsuleImageResult {
  imageBuffer: Buffer;
  contentType: string;
}

export function isImageGenerationConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateCapsuleImage({
  prompt,
  referenceImage,
  referenceImageName = "foto.png",
}: GenerateCapsuleImageParams): Promise<GenerateCapsuleImageResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY no está configurada. Añádela en tus variables de entorno para generar cápsulas reales (ver README)."
    );
  }

  const form = new FormData();
  // gpt-image-1 se retira el 23 de octubre de 2026; usamos ya su sucesor.
  // Mismo endpoint y parámetros (size, quality), solo cambia el modelo.
  form.append("model", "gpt-image-1.5");
  form.append("prompt", prompt);
  form.append("size", "1024x1024");
  form.append("quality", "high");
  form.append("image[]", referenceImage, referenceImageName);

  const response = await fetch("https://api.openai.com/v1/images/edits", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    // Guardamos el detalle técnico completo en los logs del servidor (para
    // depurar), pero al usuario le mostramos un mensaje claro y accionable
    // en vez del JSON crudo de OpenAI.
    console.error(`[image-generation] Error de OpenAI (${response.status}):`, errorBody);

    let code: string | undefined;
    try {
      code = (JSON.parse(errorBody)?.error?.code as string | undefined) ?? undefined;
    } catch {
      // el cuerpo no era JSON válido, seguimos con el mensaje genérico
    }

    if (code === "moderation_blocked") {
      throw new Error(
        "El sistema de seguridad de la IA ha bloqueado esta generación. Esto suele pasar por la fotografía subida (por ejemplo, fotos de menores sin un adulto, o imágenes de baja calidad/borrosas) o por algún texto del formulario. Prueba con otra fotografía o simplifica el mensaje/dedicatoria, y vuelve a intentarlo."
      );
    }

    throw new Error(`Error generando la imagen (${response.status}): ${errorBody}`);
  }

  const json = (await response.json()) as {
    data: Array<{ b64_json?: string; url?: string }>;
  };

  const first = json.data?.[0];

  if (!first) {
    throw new Error("El proveedor de IA no devolvió ninguna imagen.");
  }

  if (first.b64_json) {
    return {
      imageBuffer: Buffer.from(first.b64_json, "base64"),
      contentType: "image/png",
    };
  }

  if (first.url) {
    const imageResponse = await fetch(first.url);
    const arrayBuffer = await imageResponse.arrayBuffer();
    return {
      imageBuffer: Buffer.from(arrayBuffer),
      contentType: imageResponse.headers.get("content-type") ?? "image/png",
    };
  }

  throw new Error("Respuesta de generación de imagen inesperada.");
}
