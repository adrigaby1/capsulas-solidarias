"use client";

import { useState } from "react";
import { Share2, Copy, Check, Instagram } from "lucide-react";
import { SITE } from "@/lib/constants";

const SHARE_TEXT =
  "Acabo de donar para ayudar a las víctimas del terremoto en Venezuela y he recibido mi propia cápsula solidaria generada con IA 💛 Dona tú también desde 1 €:";

export function ShareButtons({
  pageUrl,
  imageUrl,
}: {
  pageUrl: string;
  imageUrl?: string | null;
}) {
  const [copied, setCopied] = useState(false);
  const [instagramHint, setInstagramHint] = useState(false);

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: SITE.name, text: SHARE_TEXT, url: pageUrl });
      } catch {
        // el usuario canceló el share, no hacemos nada
      }
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleInstagramShare() {
    // Instagram no tiene una URL web de "compartir contenido" directa.
    // En móvil, si el navegador soporta compartir archivos, mandamos la
    // propia imagen al hoja de compartir nativa (el usuario elige
    // Instagram Stories/Feed desde ahí). En escritorio, copiamos el texto
    // y abrimos Instagram para que lo pegue manualmente.
    if (imageUrl && navigator.canShare) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], "mi-capsula-solidaria.png", { type: blob.type });

        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: SITE.name,
            text: `${SHARE_TEXT} ${pageUrl}`,
          });
          return;
        }
      } catch {
        // si falla la comparticion de archivo, seguimos con el fallback
      }
    }

    await navigator.clipboard.writeText(`${SHARE_TEXT} ${pageUrl}`);
    setInstagramHint(true);
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    setTimeout(() => setInstagramHint(false), 6000);
  }

  const encodedText = encodeURIComponent(SHARE_TEXT);
  const encodedUrl = encodeURIComponent(pageUrl);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink/90"
          >
            <Share2 className="h-4 w-4" /> Compartir
          </button>
        )}

        <button
          onClick={handleInstagramShare}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium hover:border-ink/25"
        >
          <Instagram className="h-4 w-4" /> Instagram
        </button>

        <a
          href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium hover:border-ink/25"
        >
          WhatsApp
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium hover:border-ink/25"
        >
          X / Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium hover:border-ink/25"
        >
          Facebook
        </a>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-ink/10 px-5 py-2.5 text-sm font-medium hover:border-ink/25"
        >
          {copied ? <Check className="h-4 w-4 text-teal" /> : <Copy className="h-4 w-4" />}
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </button>
      </div>

      {instagramHint && (
        <p className="mt-3 text-center text-xs text-ink-soft">
          Hemos copiado el texto y abierto Instagram — pega el texto y sube la imagen descargada en tu historia o publicación.
        </p>
      )}
    </div>
  );
}
