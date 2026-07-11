"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { capsuleFormSchema, type CapsuleFormInput } from "@/lib/validations";
import { SCENARIO_OPTIONS } from "@/lib/constants";
import { PhotoUploader } from "@/components/PhotoUploader";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const STEP_LABELS = [
  "Tu foto",
  "Sobre ti",
  "Tus gustos",
  "Tu escenario",
  "Tu mensaje",
];

export function PersonalizationForm({ sessionId }: { sessionId: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Estos dos campos se manejan con estado normal de React, fuera de
  // react-hook-form: con Controller/register se detectó que el valor
  // marcado en el checkbox no siempre llegaba al envío (posible conflicto
  // con la revalidación de zodResolver). Un useState simple es la forma
  // más directa y fiable de leer "qué hay marcado ahora mismo".
  const [terremotoTheme, setTerremotoTheme] = useState(false);
  const [galleryConsent, setGalleryConsent] = useState(false);

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<CapsuleFormInput>({
    resolver: zodResolver(capsuleFormSchema),
    mode: "onBlur",
  });

  const isLastStep = step === STEP_LABELS.length - 1;

  async function goNext() {
    if (step === 0) {
      if (!photo) {
        setPhotoError("Necesitamos una foto para crear tu cápsula.");
        return;
      }
      setPhotoError(null);
      setStep((s) => s + 1);
      return;
    }

    const fieldsByStep: (keyof CapsuleFormInput)[][] = [
      [],
      ["nombre", "edad", "ciudad", "profesion"],
      [
        "hobbies",
        "deportes",
        "mascotas",
        "seriesFavoritas",
        "peliculasFavoritas",
        "videojuegosFavoritos",
        "coloresFavoritos",
        "paisFavorito",
        "suenos",
        "objetosImportantes",
        "fraseFavorita",
      ],
      ["escenario", "fechaEspecial", "celebracion", "motivo", "personaASorprender"],
    ];

    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => s + 1);
  }

  function goBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  async function onSubmit(data: CapsuleFormInput) {
    if (!photo) {
      setStep(0);
      setPhotoError("Necesitamos una foto para crear tu cápsula.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const payload: CapsuleFormInput = { ...data, terremotoTheme, galleryConsent };

    // Depuración temporal: confirma en la consola del navegador qué valores
    // tienen realmente las casillas justo antes de enviarse.
    console.log("[PersonalizationForm] Enviando formulario. terremotoTheme=", payload.terremotoTheme, "galleryConsent=", payload.galleryConsent);

    try {
      const formData = new FormData();
      formData.append("photo", photo);
      formData.append("sessionId", sessionId ?? "");
      formData.append("data", JSON.stringify(payload));

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setSubmitError(json.error ?? "No se ha podido enviar el formulario.");
        setSubmitting(false);
        return;
      }

      router.push(`/capsula/${json.submissionId}`);
    } catch {
      setSubmitError("No se ha podido conectar con el servidor. Inténtalo de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Progreso */}
      <div className="mb-10 flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={cn(
                "h-1.5 w-full rounded-full transition-colors",
                i <= step ? "bg-coral" : "bg-ink/10"
              )}
            />
            <span
              className={cn(
                "hidden text-[11px] sm:block",
                i === step ? "text-ink" : "text-ink-soft/60"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl">Sube tu fotografía</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Se usará para crear tu figura chibi personalizada, manteniendo
              tu identidad: sonrisa, mirada y peinado.
            </p>
            <div className="mt-8">
              <PhotoUploader file={photo} onChange={setPhoto} />
              {photoError && (
                <p className="mt-3 text-center text-sm text-coral-dark">{photoError}</p>
              )}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl">Cuéntanos quién eres</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Nombre" error={errors.nombre?.message}>
                <input {...register("nombre")} className={inputClass} placeholder="Tu nombre" />
              </Field>
              <Field label="Edad" error={errors.edad?.message}>
                <input {...register("edad")} className={inputClass} placeholder="Ej. 34" />
              </Field>
              <Field label="Ciudad" error={errors.ciudad?.message}>
                <input {...register("ciudad")} className={inputClass} placeholder="Tu ciudad" />
              </Field>
              <Field label="Profesión" error={errors.profesion?.message}>
                <input {...register("profesion")} className={inputClass} placeholder="A qué te dedicas" />
              </Field>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl">Tu personalidad y tus gustos</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Todo lo que compartas aquí puede convertirse en un pequeño
              objeto de colección dentro de tu cápsula.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field label="Hobbies">
                <input {...register("hobbies")} className={inputClass} placeholder="Pintar, leer, cocinar…" />
              </Field>
              <Field label="Deportes">
                <input {...register("deportes")} className={inputClass} placeholder="Running, fútbol…" />
              </Field>
              <Field label="Mascotas">
                <input {...register("mascotas")} className={inputClass} placeholder="Un perro llamado…" />
              </Field>
              <Field label="Series favoritas">
                <input {...register("seriesFavoritas")} className={inputClass} />
              </Field>
              <Field label="Películas favoritas">
                <input {...register("peliculasFavoritas")} className={inputClass} />
              </Field>
              <Field label="Videojuegos favoritos">
                <input {...register("videojuegosFavoritos")} className={inputClass} />
              </Field>
              <Field label="Colores favoritos">
                <input {...register("coloresFavoritos")} className={inputClass} placeholder="Azul, dorado…" />
              </Field>
              <Field label="País favorito">
                <input {...register("paisFavorito")} className={inputClass} />
              </Field>
              <Field label="Objetos importantes para ti">
                <input {...register("objetosImportantes")} className={inputClass} placeholder="Una guitarra, un libro…" />
              </Field>
              <Field label="Tu frase favorita">
                <input {...register("fraseFavorita")} className={inputClass} />
              </Field>
              <Field label="Tus sueños" className="sm:col-span-2">
                <textarea {...register("suenos")} rows={2} className={inputClass} />
              </Field>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-display text-2xl">El escenario de tu cápsula</h2>
            <p className="mt-2 text-sm text-ink-soft">
              Elige el mundo que mejor representa tu historia en este momento.
            </p>
            <div className="mt-6">
              <Field label="Escenario" error={errors.escenario?.message}>
                <select {...register("escenario")} className={inputClass} defaultValue="">
                  <option value="" disabled>
                    Elige un escenario
                  </option>
                  {SCENARIO_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Celebración (si aplica)">
                <input {...register("celebracion")} className={inputClass} placeholder="Cumpleaños, boda, graduación…" />
              </Field>
              <Field label="Fecha especial">
                <input {...register("fechaEspecial")} className={inputClass} />
              </Field>
              <Field label="¿A quién quieres sorprender?">
                <input {...register("personaASorprender")} className={inputClass} />
              </Field>
              <Field label="Motivo de tu donación" className="sm:col-span-2">
                <textarea {...register("motivo")} rows={2} className={inputClass} />
              </Field>
            </div>

            <div className="mt-6 space-y-4">
              <Checkbox
                checked={terremotoTheme}
                onChange={(e) => setTerremotoTheme(e.target.checked)}
                label="Quiero que mi cápsula incluya un guiño solidario al terremoto de Venezuela"
                description="Añadiremos un pequeño detalle visual (bandera, cinta o corazón solidario) en la escena, además de tu historia personal."
              />
              <Checkbox
                checked={galleryConsent}
                onChange={(e) => setGalleryConsent(e.target.checked)}
                label="Quiero que mi cápsula pueda aparecer en la galería pública de la web"
                description="Ayuda a inspirar a más personas a donar. Puedes decir que no y tu cápsula seguirá siendo solo tuya."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl">Un último mensaje</h2>
            <p className="mt-2 text-sm text-ink-soft">
              ¿Hay algo que quieras que la escena transmita? (opcional)
            </p>
            <div className="mt-6">
              <Field label="Mensaje o dedicatoria">
                <textarea {...register("mensajeDedicatoria")} rows={4} className={inputClass} />
              </Field>
            </div>

            {submitError && (
              <p className="mt-4 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-dark">
                {submitError}
              </p>
            )}
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={goBack} disabled={step === 0 || submitting}>
            Atrás
          </Button>

          {isLastStep ? (
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generando tu cápsula…
                </>
              ) : (
                "Crear mi cápsula"
              )}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Siguiente
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm outline-none focus:border-ink/30";

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block text-sm", className)}>
      <span className="mb-1.5 block font-medium text-ink">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-coral-dark">{error}</span>}
    </label>
  );
}

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string }
>(function Checkbox({ label, description, ...rest }, ref) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-ink/10 bg-white/50 p-4">
      <input
        ref={ref}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 text-coral focus:ring-coral"
        {...rest}
      />
      <span className="text-sm">
        <span className="block font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-ink-soft">{description}</span>}
      </span>
    </label>
  );
});
