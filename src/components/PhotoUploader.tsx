"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_SIZE_MB } from "@/lib/validations";

export function PhotoUploader({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(selected: File | null) {
    setError(null);

    if (!selected) {
      onChange(null);
      setPreview(null);
      return;
    }

    if (!ACCEPTED_PHOTO_TYPES.includes(selected.type)) {
      setError("Formato no soportado. Usa JPG, PNG, WEBP o HEIC.");
      return;
    }

    if (selected.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede superar los ${MAX_PHOTO_SIZE_MB} MB.`);
      return;
    }

    onChange(selected);
    setPreview(URL.createObjectURL(selected));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_PHOTO_TYPES.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 py-14 text-center transition-colors hover:border-coral/40 hover:bg-coral/5"
        >
          <ImagePlus className="h-8 w-8 text-coral" strokeWidth={1.5} />
          <span className="font-medium text-ink">Sube tu fotografía</span>
          <span className="max-w-xs text-xs text-ink-soft">
            Elige una foto donde se vea bien tu cara, de frente y con buena
            luz. JPG, PNG, WEBP o HEIC · máx. {MAX_PHOTO_SIZE_MB} MB.
          </span>
        </button>
      ) : (
        <div className="relative mx-auto w-48 overflow-hidden rounded-3xl border border-ink/10">
          {preview && (
            <Image
              src={preview}
              alt="Vista previa de tu fotografía"
              width={300}
              height={300}
              unoptimized
              className="aspect-square w-full object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => handleFile(null)}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur hover:bg-ink"
            aria-label="Quitar foto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && <p className="mt-3 text-center text-sm text-coral-dark">{error}</p>}
    </div>
  );
}
