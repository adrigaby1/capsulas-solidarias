import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  // eslint-disable-next-line no-console
  console.warn(
    "[stripe] STRIPE_SECRET_KEY no está configurada. Los pagos no funcionarán hasta que se añada en las variables de entorno."
  );
}

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
