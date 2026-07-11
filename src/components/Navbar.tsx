"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft } from "lucide-react";
import { SITE } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { BrandIcon } from "@/components/BrandIcon";

const NAV_LINKS = [
  { href: "/#historia", label: "La historia" },
  { href: "/#destino", label: "Destino de tu ayuda" },
  { href: "/#como-funciona", label: "Cómo funciona" },
  { href: "/galeria", label: "Galería" },
  { href: "/#preguntas", label: "Preguntas" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-6 py-4 md:px-10">
        <div className="flex items-center gap-3">
          {!isHome && (
            <Link
              href="/"
              aria-label="Volver al inicio"
              className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ink-soft hover:bg-ink/5 hover:text-ink md:hidden"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <BrandIcon className="h-8 w-8" />
            <span className="font-display text-lg tracking-tight">{SITE.name}</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="/donar" size="sm">
            Donar ahora
          </Button>

          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/5 md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/5 bg-cream px-6 py-3 md:hidden">
          <ul className="flex flex-col divide-y divide-ink/5">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-[15px] text-ink-soft hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
