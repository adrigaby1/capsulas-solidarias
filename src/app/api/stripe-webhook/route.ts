import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

/**
 * Webhook de Stripe. Configúralo en el dashboard de Stripe apuntando a
 * https://tu-dominio.com/api/stripe-webhook, escuchando el evento
 * "checkout.session.completed", y copia el "signing secret" en
 * STRIPE_WEBHOOK_SECRET.
 *
 * Este es el punto de la aplicación que confirma de forma fiable que el
 * pago se ha completado (no depende de que el usuario vuelva a la página
 * de éxito), por lo que aquí es donde se registra la donación como "paid".
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  const rawBody = await request.text();

  if (!webhookSecret || !signature) {
    console.warn("[stripe-webhook] Falta STRIPE_WEBHOOK_SECRET o la cabecera de firma.");
    return NextResponse.json({ error: "Webhook no configurado." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Firma inválida:", error);
    return NextResponse.json({ error: "Firma inválida." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = getSupabaseServiceClient();
      await supabase.from("donations").upsert(
        {
          stripe_session_id: session.id,
          amount_cents: session.amount_total ?? 0,
          currency: session.currency ?? "eur",
          donor_email: session.customer_details?.email ?? null,
          status: "paid",
        },
        { onConflict: "stripe_session_id" }
      );
    } catch (error) {
      console.error("[stripe-webhook] Error guardando la donación en Supabase:", error);
      // Devolvemos 200 igualmente para que Stripe no reintente indefinidamente
      // un error que es nuestro (de configuración de Supabase), no del pago.
    }
  }

  return NextResponse.json({ received: true });
}
