import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-cream-dark/60">
      <Container className="flex flex-col gap-6 py-10 text-sm text-ink-soft md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-base text-ink">{SITE.name}</p>
          <p className="mt-1 max-w-sm">
            Una iniciativa solidaria e independiente. No es un producto comercial:
            el 100% de lo recaudado se destina a la ayuda humanitaria.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/#destino" className="hover:text-ink">
            Transparencia
          </Link>
          <Link href="/galeria" className="hover:text-ink">
            Galería
          </Link>
          <Link href="/legal/privacidad" className="hover:text-ink">
            Privacidad
          </Link>
          <Link href="/legal/terminos" className="hover:text-ink">
            Términos
          </Link>
          <a href={`mailto:${SITE.supportEmail}`} className="hover:text-ink">
            {SITE.supportEmail}
          </a>
        </div>
      </Container>
    </footer>
  );
}
