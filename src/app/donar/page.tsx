import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { DonationForm } from "@/components/DonationForm";
import { CapsuleIllustration } from "@/components/CapsuleIllustration";

export const metadata: Metadata = {
  title: "Dona ahora",
};

export default function DonarPage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="grid items-center gap-16 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark">
            Paso 1 de 3
          </span>
          <h1 className="font-display mt-4 text-3xl leading-tight md:text-4xl">
            Tu donación, tu ritmo
          </h1>
          <p className="mt-3 max-w-sm text-ink-soft">
            Elige cuánto quieres aportar. Al confirmar el pago, podrás crear
            tu cápsula personalizada en el siguiente paso.
          </p>

          <div className="mt-10 max-w-md rounded-3xl border border-ink/8 bg-white/60 p-6 md:p-8">
            <DonationForm />
          </div>
        </div>

        <div className="order-1 mx-auto aspect-[4/4.6] w-full max-w-xs md:order-2">
          <CapsuleIllustration accent="teal" />
        </div>
      </Container>
    </section>
  );
}
