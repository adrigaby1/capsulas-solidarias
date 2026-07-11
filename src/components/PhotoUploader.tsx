"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { ACCEPTED_PHOTO_TYPES, MAX_PHOTO_SIZE_MB, MAX_UPLOAD_SIZE_MB } from "@/lib/validations";

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
  const [processing, setProcessing] = useState(false);

  async function handleFile(selected: File | null) {
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

    setProcessing(true);
    // Las fotos de cámara de móvil suelen pesar varios MB a resolución
    // completa. Vercel rechaza (a nivel de plataforma, antes de que nuestro
    // código se ejecute) cualquier petición de más de ~4,5 MB, y además
    // decodificar una foto enorme para la vista previa puede ir muy lento
    // o fallar en según qué móvil. Por eso comprimimos aquí, en el
    // navegador, antes de previsualizar y de guardar el archivo definitivo.
    const finalFile = await compressImage(selected);
    setProcessing(false);

    if (finalFile.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setError(
        "No hemos podido optimizar esta fotografía lo suficiente. Prueba con otra foto (idealmente en JPG) o haz una captura de menor resolución."
      );
      return;
    }

    onChange(finalFile);
    setPreview(URL.createObjectURL(finalFile));
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
          disabled={processing}
          className="flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-ink/15 bg-white/50 py-14 text-center transition-colors hover:border-coral/40 hover:bg-coral/5 disabled:opacity-60"
        >
          <ImagePlus className="h-8 w-8 text-coral" strokeWidth={1.5} />
          <span className="font-medium text-ink">
            {processing ? "Optimizando tu foto…" : "Sube tu fotografía"}
          </span>
          <span className="max-w-xs text-xs text-ink-soft">
            Elige una foto donde se vea bien tu cara, de frente y con buena
            luz. JPG, PNG, WEBP o HEIC · máx. {MAX_PHOTO_SIZE_MB} MB.
          </span>
        </button>
      ) : (
        <div className="relative mx-auto w-48 overflow-hidden rounded-3xl border border-ink/10">
          {preview && (
            // Nota: esto es una vista previa local (blob: URL) del archivo
            // ya comprimido, no una imagen remota — usamos <img> nativo en
            // vez de next/image (que en algunos navegadores móviles no
            // renderiza bien las URLs blob: aunque esté "unoptimized").
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Vista previa de tu fotografía"
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

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

/**
 * Redimensiona y recomprime una imagen en el propio navegador antes de
 * subirla. Si el navegador no consigue decodificarla (p. ej. algunos HEIC
 * reales en Chrome/Android), se devuelve el archivo original tal cual: el
 * servidor ya sabe normalizar cualquier formato antes de mandarlo a la IA
 * (ver src/lib/normalize-image.ts).
 */
async function compressImage(file: File): Promise<File> {
  try {
    const objectUrl = URL.createObjectURL(file);
    const image = await loadImage(objectUrl);
    URL.revokeObjectURL(objectUrl);

    let { width, height } = image;
    if (width <= 0 || height <= 0) return file;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      const scale = MAX_DIMENSION / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );

    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se ha podido decodificar la imagen."));
    img.src = src;
  });
}
