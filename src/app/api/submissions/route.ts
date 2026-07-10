import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSupabaseServiceClient, STORAGE_BUCKET } from "@/lib/supabase/server";
import { capsuleFormSchema } from "@/lib/validations";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { runImageGeneration } from "@/lib/generate-and-store";

export const runtime = "nodejs";
export const maxDuration = 60;

async function resolveDonationId(supabase: ReturnType<typeof getSupabaseServiceClient>, sessionId: string) {
  const { data } = await supabase
    .from("donations")
    .select("id")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (data) return data.id;

  // El webhook puede no haber llegado aún: comprobamos directamente en Stripe
  // y creamos el registro de la donación para no bloquear al usuario.
  if (!isStripeConfigured()) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const { data: inserted, error } = await supabase
      .from("donations")
      .upsert(
        {
          stripe_session_id: session.id,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          donor_email: session.customer_details?.email ?? null,
          status: session.payment_status === "paid" ? "paid" : "pending",
        },
        { onConflict: "stripe_session_id" }
      )
      .select("id")
      .single();

    if (error) throw error;
    return inserted.id;
  } catch (error) {
    console.error("[submissions] No se pudo resolver la donación:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  let supabase;
  try {
    supabase = getSupabaseServiceClient();
  } catch {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno todavía." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const photo = formData.get("photo");
  const sessionId = String(formData.get("sessionId") ?? "");
  const rawData = String(formData.get("data") ?? "{}");

  if (!(photo instanceof File)) {
    return NextResponse.json({ error: "Falta la fotografía." }, { status: 400 });
  }

  const parsed = capsuleFormSchema.safeParse(JSON.parse(rawData));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos del formulario inválidos." },
      { status: 400 }
    );
  }

  const donationId = sessionId ? await resolveDonationId(supabase, sessionId) : null;

  const submissionId = uuidv4();
  const photoExt = photo.name.split(".").pop() || "jpg";
  const photoPath = `${submissionId}/original.${photoExt}`;

  const photoBuffer = Buffer.from(await photo.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(photoPath, photoBuffer, { contentType: photo.type, upsert: true });

  if (uploadError) {
    console.error("[submissions] Error subiendo la foto:", uploadError);
    return NextResponse.json({ error: "No se ha podido subir la fotografía." }, { status: 500 });
  }

  const { data: photoUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(photoPath);

  // Log de depuración: si algún día vuelve a guardarse mal el consentimiento
  // de galería, esto muestra en el terminal exactamente lo que llegó del
  // formulario (antes de tocar la base de datos) para saber si el fallo
  // está en el cliente o en el servidor.
  console.log("[submissions] Recibido del formulario:", {
    terremotoTheme: parsed.data.terremotoTheme,
    galleryConsent: parsed.data.galleryConsent,
  });

  const { error: insertError } = await supabase.from("submissions").insert({
    id: submissionId,
    donation_id: donationId,
    photo_url: photoUrlData.publicUrl,
    form_data: parsed.data,
    status: "pending",
    gallery_consent: Boolean(parsed.data.galleryConsent),
  });

  if (insertError) {
    console.error("[submissions] Error creando el registro:", insertError);
    return NextResponse.json({ error: "No se ha podido guardar tu formulario." }, { status: 500 });
  }

  // Generamos la imagen dentro del mismo request (adecuado para el tamaño
  // de este proyecto; maxDuration=60 da margen suficiente). Si el volumen
  // crece, esto debería moverse a una cola (QStash, Supabase Edge
  // Functions o un worker dedicado) para no bloquear la respuesta HTTP.
  try {
    await runImageGeneration(submissionId);
  } catch (error) {
    // No devolvemos error al cliente: la submission queda marcada como
    // "error" en la base de datos y la página de resultado permite
    // reintentar la generación desde /api/generate-image.
    console.error("[submissions] Error en la generación de imagen:", error);
  }

  return NextResponse.json({ submissionId });
}
