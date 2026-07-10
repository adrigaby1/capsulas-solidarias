"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Loader2 } from "lucide-react";

type Status = "checking" | "paid" | "pending" | "error";

export function ExitoClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const res = await fetch(`/api/donations/${sessionId}`);
        const json = await res.json();

        if (cancelled) return;

        if (json.status === "paid") {
          setStatus("paid");
          return;
        }

        if (attempts < 10) {
          setTimeout(poll, 1500);
        } else {
          setStatus("pending");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (status === "checking") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-coral" />
        <p className="text-ink-soft">Confirmando tu donación…</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-teal" />
        <h1 className="font-display text-3xl md:text-4xl">¡Gracias por tu ayuda!</h1>
        <p className="max-w-md text-ink-soft">
          Tu donación se ha confirmado correctamente. Ahora vamos a crear tu
          cápsula personalizada — solo necesitamos una foto tuya y unos
          detalles sobre ti.
        </p>
        <Button href={`/crea-tu-capsula?session_id=${sessionId}`} size="lg" className="mt-2">
          Crear mi cápsula
        </Button>
      </div>
    );
  }

  if (status === "pending") {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-amber" />
        <h1 className="font-display text-2xl">Estamos confirmando tu pago</h1>
        <p className="max-w-md text-ink-soft">
          A veces tarda unos segundos más de lo habitual. Puedes refrescar
          esta página o continuar y crear tu cápsula: la desbloquearemos en
          cuanto confirmemos el pago.
        </p>
        <Button href={`/crea-tu-capsula?session_id=${sessionId}`} size="lg" className="mt-2">
          Continuar de todos modos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center">
      <h1 className="font-display text-2xl">No hemos podido verificar tu pago</h1>
      <p className="max-w-md text-ink-soft">
        Si el cargo se ha realizado en tu cuenta, escríbenos y lo resolvemos
        enseguida.
      </p>
      <Button href="/donar" variant="outline" size="lg">
        Volver a intentar
      </Button>
    </div>
  );
}
