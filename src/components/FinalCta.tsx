import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber/15 via-coral/10 to-teal/15"
      />
      <Container className="relative text-center">
        <h2 className="font-display mx-auto max-w-2xl text-balance text-3xl leading-tight md:text-5xl">
          Gracias por ayudar.
          <br />
          <span className="italic text-coral">Ni siquiera hace falta decirlo.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-ink-soft">
          Tu cápsula lo dirá por ti. Empieza con solo 1 €.
        </p>
        <Button href="/donar" size="lg" className="mt-8">
          Donar y crear mi cápsula
        </Button>
      </Container>
    </section>
  );
}
