import { Section, Eyebrow } from "@/components/ui/Section";
import { Heart, ImageIcon, MessageCircleHeart, Share2, Upload } from "lucide-react";

const STEPS = [
  {
    icon: Heart,
    title: "Dona lo que quieras",
    description: "Desde 1 €. Tú decides el importe, sin mínimos que importen.",
  },
  {
    icon: Upload,
    title: "Sube tu foto",
    description: "Y cuéntanos algo sobre ti: tus gustos, tu historia, tu momento especial.",
  },
  {
    icon: ImageIcon,
    title: "Recibe tu cápsula",
    description: "Nuestra IA crea una cápsula Gashapon única con tu figura chibi personalizada.",
  },
  {
    icon: Share2,
    title: "Compártela",
    description: "Inspira a más personas a donar y multiplica el impacto de tu gesto.",
  },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona">
      <div className="text-center">
        <Eyebrow>Cómo funciona</Eyebrow>
        <h2 className="font-display mx-auto mt-5 max-w-2xl text-3xl leading-tight md:text-4xl">
          Sencillo, emocionante y transparente
        </h2>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-4">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="group relative rounded-3xl border border-ink/8 bg-white/60 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
          >
            <span className="absolute right-5 top-5 font-display text-2xl text-ink/10">
              0{i + 1}
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber/20 to-coral/20 text-coral">
              <step.icon className="h-5 w-5" strokeWidth={1.75} />
            </div>
            <h3 className="mt-5 font-display text-lg">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-10 flex max-w-md items-center justify-center gap-2 text-center text-sm text-ink-soft">
        <MessageCircleHeart className="h-4 w-4 text-coral" />
        Todo el proceso —donación, formulario y descarga— se hace en menos de 5 minutos.
      </p>
    </Section>
  );
}
