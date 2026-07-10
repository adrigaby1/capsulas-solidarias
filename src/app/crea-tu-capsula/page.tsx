import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CreaClient } from "./CreaClient";

export const metadata: Metadata = {
  title: "Crea tu cápsula",
};

export default function CreaTuCapsulaPage() {
  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark">
            Paso 2 de 3
          </span>
          <h1 className="font-display mt-4 text-3xl leading-tight md:text-4xl">
            Ahora, cuéntanos tu historia
          </h1>
        </div>

        <Suspense fallback={<div className="text-center text-ink-soft">Cargando…</div>}>
          <CreaClient />
        </Suspense>
      </Container>
    </section>
  );
}
