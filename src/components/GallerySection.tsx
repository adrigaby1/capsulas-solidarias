import { Section, Eyebrow } from "@/components/ui/Section";
import { CapsuleIllustration } from "@/components/CapsuleIllustration";
import { Button } from "@/components/ui/Button";

const EXAMPLES = [
  { accent: "coral" as const, label: "Escenario: Montaña" },
  { accent: "teal" as const, label: "Escenario: Música" },
  { accent: "amber" as const, label: "Escenario: Bebé" },
];

export function GallerySection() {
  return (
    <Section className="bg-white/40">
      <div className="text-center">
        <Eyebrow>Estilo visual</Eyebrow>
        <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl leading-tight md:text-4xl">
          Siempre la misma estética. Siempre tu historia.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-ink-soft">
          Cada cápsula mantiene el mismo estilo premium: cristal hiperrealista,
          figura chibi de colección y un pequeño diorama construido a partir
          de lo que nos cuentes.
        </p>
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {EXAMPLES.map((example) => (
          <div key={example.label} className="text-center">
            <div className="mx-auto aspect-[4/4.6] w-full max-w-[260px]">
              <CapsuleIllustration accent={example.accent} />
            </div>
            <p className="mt-4 text-sm font-medium text-ink-soft">{example.label}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-lg text-center text-xs text-ink-soft/70">
        Ilustraciones representativas del concepto de marca. Tu cápsula final
        se genera con IA a partir de tu fotografía real.
      </p>

      <div className="mt-8 text-center">
        <Button href="/galeria" variant="outline">
          Ver cápsulas creadas por la comunidad →
        </Button>
      </div>
    </Section>
  );
}
