"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/gallery";
import { formatEuros } from "@/lib/utils";

/**
 * Antes, cada miniatura enlazaba a /capsula/[id] — la misma página de
 * "resultado" que ve cada donante justo tras crear su cápsula, con botones
 * de descargar/compartir. Eso salía igual para la cápsula de cualquier
 * persona (no distinguía de quién era), así que aquí montamos un visor
 * propio de la galería: se abre en la misma página, con flechas para
 * pasar entre cápsulas y mostrando solo lo que cada persona decidió
 * compartir (nombre, escenario y, si lo autorizó, el importe donado) —
 * sin acciones de descarga/compartir que no tienen sentido para una
 * cápsula que no es la tuya.
 */
export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const showPrev = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const showNext = useCallback(
    () => setOpenIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (openIndex === null) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, close, showPrev, showNext]);

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <>
      <div className="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group overflow-hidden rounded-2xl border border-ink/8 bg-white/50 text-left transition-shadow hover:shadow-xl hover:shadow-ink/10"
          >
            <div className="aspect-square overflow-hidden">
              <Image
                src={item.imageUrl}
                alt={`Cápsula solidaria de ${item.nombre}`}
                width={400}
                height={400}
                unoptimized
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-ink">
                {item.nombre}
                {item.donationAmountCents != null && (
                  <span className="text-coral-dark"> · Donó {formatEuros(item.donationAmountCents)}</span>
                )}
              </p>
              {item.escenario && (
                <p className="truncate text-xs text-ink-soft">{item.escenario}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                aria-label="Cápsula anterior"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                aria-label="Cápsula siguiente"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="flex max-h-full w-full max-w-md flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
              <Image
                key={active.id}
                src={active.imageUrl}
                alt={`Cápsula solidaria de ${active.nombre}`}
                width={800}
                height={800}
                unoptimized
                className="w-full"
              />
            </div>
            <div className="text-center text-white">
              <p className="font-display text-lg">
                {active.nombre}
                {active.donationAmountCents != null && (
                  <span className="text-coral"> · Donó {formatEuros(active.donationAmountCents)}</span>
                )}
              </p>
              {active.escenario && (
                <p className="text-sm text-white/60">{active.escenario}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
