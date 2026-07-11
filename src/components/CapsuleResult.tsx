"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { ShareButtons } from "@/components/ShareButtons";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";

type Status = "pending" | "generating" | "ready" | "error";

interface SubmissionState {
  status: Status;
  image_url: string | null;
  error_message?: string | null;
}

const LOADING_MESSAGES = [
  "Soplando el cristal de tu cápsula…",
  "Dando forma a tu figura chibi…",
  "Colocando cada miniatura en su sitio…",
  "Ajustando la luz cinematográfica…",
  "Puliendo los últimos reflejos…",
];

export function CapsuleResult({ submissionId }: { submissionId: string }) {
  const [state, setState] = useState<SubmissionState>({ status: "pending", image_url: null });
  const [messageIndex, setMessageIndex] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/submissions/${submissionId}`);
        const json = await res.json();
        if (cancelled) return;

        setState(json);

        if (json.status === "pending" || json.status === "generating") {
          setTimeout(poll, 2500);
        }
      } catch {
        if (!cancelled) setTimeout(poll, 3000);
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  async function refreshStatus() {
    try {
      const res = await fetch(`/api/submissions/${submissionId}`);
      const json = await res.json();
      setState(json);
    } catch {
      // si falla la comprobación, dejamos el estado de error visible
      // para que el usuario pueda pulsar "Reintentar" de nuevo
    }
  }

  async function handleRetry() {
    setRetrying(true);
    setState((s) => ({ ...s, status: "generating" }));
    try {
      // Esta llamada espera a que termine toda la generación (puede
      // tardar 1-3 minutos), así que al resolver ya sabemos el resultado
      // final. Volvemos a consultar la submission para reflejarlo en la UI
      // (tanto si ha ido bien como si ha vuelto a fallar).
      await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId }),
      });
    } finally {
      await refreshStatus();
      setRetrying(false);
    }
  }

  async function handleDownload() {
    if (!state.image_url || downloading) return;
    setDownloading(true);
    try {
      // La imagen vive en Supabase Storage (otro dominio), y el atributo
      // download de <a> no funciona en enlaces cross-origin: el navegador
      // simplemente abre la imagen en vez de descargarla. Para forzar la
      // descarga real, la traemos como blob y creamos un enlace temporal
      // a una URL local (blob:), que sí respeta "download".
      const res = await fetch(state.image_url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "mi-capsula-solidaria.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Si algo falla (red, CORS…), al menos abrimos la imagen para que
      // el usuario pueda guardarla manualmente con clic derecho.
      window.open(state.image_url, "_blank");
    } finally {
      setDownloading(false);
    }
  }

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : `${SITE.url}/capsula/${submissionId}`;

  if (state.status === "pending" || state.status === "generating") {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-amber/25 via-coral/20 to-teal/20 blur-xl" />
          <Sparkles className="h-12 w-12 text-coral" />
        </div>
        <h1 className="font-display text-2xl md:text-3xl">Creando tu cápsula</h1>
        <p className="max-w-sm text-ink-soft transition-opacity">
          {LOADING_MESSAGES[messageIndex]}
        </p>
        <p className="text-xs text-ink-soft/60">Esto suele tardar entre 2 y 5 minutos.</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center">
        <h1 className="font-display text-2xl">Algo no ha salido bien</h1>
        <p className="max-w-sm text-ink-soft">
          {state.error_message ??
            "No hemos podido generar tu cápsula. Puede deberse a un problema temporal con el proveedor de IA."}
        </p>
        <Button onClick={handleRetry} disabled={retrying} size="lg">
          {retrying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-12 text-center">
      <div>
        <h1 className="font-display text-3xl md:text-4xl">Tu cápsula está lista</h1>
        <p className="mt-2 text-ink-soft">Gracias por convertir tu ayuda en algo inolvidable.</p>
      </div>

      {state.image_url && (
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 shadow-2xl shadow-ink/10">
          <Image
            src={state.image_url}
            alt="Tu cápsula solidaria personalizada"
            width={1024}
            height={1024}
            unoptimized
            className="w-full"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        {state.image_url && (
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-medium text-white hover:bg-coral-dark disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Descargando…" : "Descargar mi cápsula"}
          </button>
        )}
      </div>

      <div className="mt-2">
        <p className="mb-3 text-sm font-medium text-ink-soft">Comparte tu cápsula y multiplica la ayuda</p>
        <ShareButtons pageUrl={pageUrl} imageUrl={state.image_url} />
      </div>

      <Button href="/donar" variant="ghost" className="mt-4">
        Hacer otra donación
      </Button>
    </div>
  );
}
