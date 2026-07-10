import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { ExitoClient } from "./ExitoClient";

export default function DonarExitoPage() {
  return (
    <Container className="max-w-xl">
      <Suspense fallback={<div className="py-16 text-center text-ink-soft">Cargando…</div>}>
        <ExitoClient />
      </Suspense>
    </Container>
  );
}
