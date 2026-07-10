import { NextRequest, NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { donationAmountSchema } from "@/lib/validations";
import { DONATION, SITE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe no está configurado todavía en este entorno. Añade STRIPE_SECRET_KEY para aceptar donaciones reales.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = donationAmountSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Datos de donación inválidos." },
      { status: 400 }
    );
  }

  const { amount, email } = parsed.data;
  const origin = request.headers.get("origin") ?? SITE.url;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: DONATION.currency,
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `Donación solidaria — ${SITE.name}`,
              description:
                "Ayuda a las víctimas del terremoto en Venezuela. Como agradecimiento, recibirás tu cápsula personalizada generada con IA.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/donar/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donar`,
      metadata: {
        source: "capsulas-solidarias-ia",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout] Error creando la sesión de Stripe:", error);
    return NextResponse.json(
      { error: "No se ha podido iniciar el pago. Inténtalo de nuevo en unos segundos." },
      { status: 500 }
    );
  }
}
