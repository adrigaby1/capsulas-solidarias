import Link from "next/link";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/BrandIcon";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <BrandIcon className="h-8 w-8" />
          <span className="font-display text-lg tracking-tight">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          <Link href="/#historia" className="hover:text-ink">
            La historia
          </Link>
          <Link href="/#destino" className="hover:text-ink">
            Destino de tu ayuda
          </Link>
          <Link href="/#como-funciona" className="hover:text-ink">
            Cómo funciona
          </Link>
          <Link href="/galeria" className="hover:text-ink">
            Galería
          </Link>
          <Link href="/#preguntas" className="hover:text-ink">
            Preguntas
          </Link>
        </nav>

        <Button href="/donar" size="sm">
          Donar ahora
        </Button>
      </div>
    </header>
  );
}
