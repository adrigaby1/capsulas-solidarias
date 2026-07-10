import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Comprueba el estado de una donación a partir del session_id de Stripe.
 * Se usa en /donar/exito para saber si el pago se ha confirmado y así
 * desbloquear el formulario de personalización.
 *
 * Primero consulta Supabase (fuente de verdad, actualizada por el
 * webhook). Si todavía no hay registro (el webhook puede tardar unos
 * segundos), consulta directamente a Stripe como respaldo.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;

  try {
    const supabase = getSupabaseServiceClient();
    const { data } = await supabase
      .from("donations")
      .select("id, status, amount_cents, currency")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (data) {
      return NextResponse.json({
        donationId: data.id,
        status: data.status,
        amountCents: data.amount_cents,
        currency: data.currency,
      });
    }
  } catch {
    // Supabase no configurado o error transitorio: seguimos con el respaldo de Stripe.
  }

  if (!isStripeConfigured()) {
    return NextResponse.json({ status: "pending" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return NextResponse.json({
      donationId: null,
      status: session.payment_status === "paid" ? "paid" : "pending",
      amountCents: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
    });
  } catch (error) {
    console.error("[donations/:sessionId] Error consultando Stripe:", error);
    return NextResponse.json({ status: "pending" });
  }
}
