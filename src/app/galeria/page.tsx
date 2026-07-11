import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/gallery";
import { Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Galería de cápsulas solidarias",
  description:
    "Descubre las cápsulas creadas por otras personas que ya han donado para ayudar a las víctimas del terremoto en Venezuela.",
};

export const revalidate = 60;

export default async function GaleriaPage() {
  const items = await getGalleryItems();

  return (
    <section className="py-16 md:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark">
            Galería
          </span>
          <h1 className="font-display mt-4 text-3xl leading-tight md:text-4xl">
            Cápsulas creadas por la comunidad
          </h1>
          <p className="mt-3 text-ink-soft">
            Cada una de estas cápsulas representa una donación real. Compartidas
            con el permiso de cada persona, para inspirar a más gente a ayudar.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-4 text-center">
            <Heart className="h-8 w-8 text-coral" />
            <p className="text-ink-soft">
              Todavía no hay cápsulas públicas — sé la primera persona en
              aparecer aquí y anima a otros a donar.
            </p>
            <Button href="/donar" size="lg">
              Donar y crear mi cápsula
            </Button>
          </div>
        ) : (
          <GalleryGrid items={items} />
        )}

        <div className="mt-16 text-center">
          <Button href="/donar" variant="outline" size="lg">
            Crear mi propia cápsula
          </Button>
        </div>
      </Container>
    </section>
  );
}
