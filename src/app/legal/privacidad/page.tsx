import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Privacidad" };

export default function PrivacidadPage() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-display text-3xl">Política de privacidad</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
        <p>
          En {SITE.name} tratamos tus datos personales (nombre, email,
          fotografía y las respuestas del formulario de personalización)
          únicamente para gestionar tu donación y generar tu cápsula
          personalizada.
        </p>
        <p>
          Tu fotografía se utiliza exclusivamente para la generación de la
          imagen por IA y se almacena de forma segura. No se cede a
          terceros con fines comerciales ni se utiliza para entrenar
          modelos de IA de terceros.
        </p>
        <p>
          Los pagos son procesados directamente por Stripe; no almacenamos
          en ningún momento los datos de tu tarjeta.
        </p>
        <p>
          Puedes solicitar el acceso, rectificación o eliminación de tus
          datos escribiendo a {SITE.supportEmail}.
        </p>
        <p className="text-xs text-ink-soft/70">
          Documento de ejemplo — sustituir por el texto legal definitivo,
          adaptado a RGPD, antes de salir a producción.
        </p>
      </div>
    </Container>
  );
}
