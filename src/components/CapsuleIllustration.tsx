import { cn } from "@/lib/utils";

/**
 * Ilustración de marca (no una fotografía real generada por IA) que
 * representa el concepto de la cápsula Gashapon. Se usa como placeholder
 * visual elegante en el hero y en la galería de ejemplo mientras no hay
 * imágenes reales de usuarios que mostrar.
 */
export function CapsuleIllustration({
  className,
  accent = "coral",
}: {
  className?: string;
  accent?: "coral" | "teal" | "amber";
}) {
  const accentColor =
    accent === "teal" ? "#2f8f86" : accent === "amber" ? "#c9a26d" : "#e8735c";

  return (
    <svg
      viewBox="0 0 400 460"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
    >
      <defs>
        <radialGradient id={`glow-${accent}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`glass-${accent}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <ellipse cx="200" cy="240" rx="190" ry="190" fill={`url(#glow-${accent})`} />

      {/* Dedos sosteniendo la cápsula */}
      <path
        d="M110 340c-10 30-8 60 10 78 16 15 34 8 40-6"
        stroke="#26221e"
        strokeOpacity="0.18"
        strokeWidth="26"
        strokeLinecap="round"
      />
      <path
        d="M290 340c10 30 8 60-10 78-16 15-34 8-40-6"
        stroke="#26221e"
        strokeOpacity="0.18"
        strokeWidth="26"
        strokeLinecap="round"
      />

      {/* Cuerpo de la cápsula de cristal */}
      <circle
        cx="200"
        cy="210"
        r="145"
        fill={`url(#glass-${accent})`}
        stroke="#ffffff"
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <circle cx="200" cy="210" r="145" fill="none" stroke={accentColor} strokeOpacity="0.25" strokeWidth="10" />

      {/* Línea ecuatorial de la cápsula gashapon */}
      <line x1="58" y1="210" x2="342" y2="210" stroke="#26221e" strokeOpacity="0.12" strokeWidth="3" />

      {/* Reflejo de luz */}
      <path
        d="M110 130c20-30 55-45 85-45"
        stroke="#ffffff"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Figura chibi simplificada dentro */}
      <circle cx="200" cy="165" r="42" fill={accentColor} opacity="0.9" />
      <circle cx="185" cy="158" r="5" fill="#26221e" />
      <circle cx="215" cy="158" r="5" fill="#26221e" />
      <path d="M186 178c8 8 20 8 28 0" stroke="#26221e" strokeWidth="4" strokeLinecap="round" fill="none" />
      <rect x="172" y="205" width="56" height="55" rx="20" fill={accentColor} opacity="0.75" />

      {/* Miniaturas del diorama */}
      <circle cx="130" cy="255" r="14" fill="#2f8f86" opacity="0.7" />
      <rect x="248" y="235" width="26" height="34" rx="6" fill="#c9a26d" opacity="0.8" />
      <path d="M120 275l16-22 16 22z" fill="#e8735c" opacity="0.55" />

      {/* Base de la cápsula */}
      <path
        d="M75 235c0 62 56 112 125 112s125-50 125-112"
        stroke={accentColor}
        strokeOpacity="0.15"
        strokeWidth="6"
      />
    </svg>
  );
}
