import { Button } from "@/components/ui/Button";
import { CapsuleIllustration } from "@/components/CapsuleIllustration";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber/20 via-coral/10 to-teal/10 blur-3xl"
      />

      <Container className="relative grid items-center gap-16 md:grid-cols-2">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
            Terremoto en Venezuela · Ayuda de emergencia
          </span>

          <h1 className="font-display mt-6 text-balance text-4xl leading-[1.08] tracking-tight md:text-6xl">
            Una imagen única.
            <br />
            <span className="italic text-coral">Una donación real.</span>
            <br />
            Miles de vidas ayudadas.
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            Dona desde 1 €, comparte una foto tuya y recibe como agradecimiento
            tu propia cápsula Gashapon de cristal, una figura chibi
            personalizada creada con IA que cuenta tu historia.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/donar" size="lg">
              Donar y crear mi cápsula
            </Button>
            <Button href="#historia" variant="ghost" size="lg">
              Conocer la historia →
            </Button>
          </div>

          <p className="mt-6 text-xs text-ink-soft">
            Pagos seguros con Stripe · 100% del importe destinado a la ayuda humanitaria
          </p>
        </div>

        <div className="relative mx-auto aspect-[4/4.6] w-full max-w-sm animate-float-slow">
          <CapsuleIllustration accent="coral" />
        </div>
      </Container>
    </section>
  );
}
