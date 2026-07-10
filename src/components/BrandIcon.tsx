/**
 * Icono de marca: cápsula = corazón = persona protegida.
 * Basado en el manual de identidad (cápsula partida en dos mitades —
 * superior en teal con la silueta de una persona, inferior en coral con
 * un corazón—). Se usa como favicon (ver src/app/icon.svg) y aquí, en
 * línea, como logotipo en la interfaz.
 */
export function BrandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M 60,100 L 60,80 A 40,40 0 0 1 140,80 L 140,100"
        fill="none"
        stroke="#00B2A9"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 60,100 L 60,120 A 40,40 0 0 0 140,120 L 140,100"
        fill="none"
        stroke="#E03E52"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 75,52 A 46,46 0 0 0 60,66"
        fill="none"
        stroke="#00B2A9"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M 88,44 A 58,58 0 0 0 66,58"
        fill="none"
        stroke="#00B2A9"
        strokeWidth="4"
        strokeLinecap="round"
        opacity={0.7}
      />
      <circle cx="100" cy="62" r="12" fill="#00B2A9" />
      <path d="M 78,99 C 78,82 87,76 100,76 C 113,76 122,82 122,99 Z" fill="#00B2A9" />
      <path
        d="M 100,156 C 84,141 72,133 72,120 C 72,109 81,102 90,105 C 95,107 98,112 100,117 C 102,112 105,107 110,105 C 119,102 128,109 128,120 C 128,133 116,141 100,156 Z"
        fill="#E03E52"
      />
    </svg>
  );
}
