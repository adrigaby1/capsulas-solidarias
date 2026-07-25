import Image from "next/image";

const SUPABASE_BASE =
  "https://klutkfkrfwteanidyyrr.supabase.co/storage/v1/object/public/capsule-results";

type CollageItem = {
  src: string;
  alt: string;
  caption: string;
  detail?: string;
  className: string;
  rotate: string;
  delay: string;
  priority?: boolean;
};

const ITEMS: CollageItem[] = [
  {
    src: "/capsulas/capsula-gabriela.webp",
    alt: "Cápsula solidaria real de Gabriela: figura chibi con su perrito y casitas doradas",
    caption: "Gabriela",
    detail: "Hogar",
    className: "left-[19%] top-[16%] z-30 w-[56%]",
    rotate: "-rotate-2",
    delay: "0s",
    priority: true,
  },
  {
    src: `${SUPABASE_BASE}/e4efdde8-775d-4c20-9767-afab7891505e/8f21d6ad-fd3b-4ed7-9201-680e6f73ded8.png`,
    alt: "Cápsula solidaria real de Alicia, con un diorama de medicina",
    caption: "Alicia · Donó 1 €",
    detail: "Medicina",
    className: "left-[-2%] top-[-2%] z-20 w-[38%]",
    rotate: "-rotate-6",
    delay: "1.2s",
  },
  {
    src: "/capsulas/capsula-lilly.webp",
    alt: "Cápsula solidaria real de Lilly, celebrando su cumpleaños con su cámara de fotos",
    caption: "Lilly",
    detail: "Fiesta",
    className: "right-[-2%] top-[2%] z-10 w-[36%]",
    rotate: "rotate-6",
    delay: "2.1s",
  },
  {
    src: "/capsulas/capsula-enfermero.webp",
    alt: "Cápsula solidaria real de Edgar, médico, con la bandera de Venezuela y un corazón",
    caption: "Edgar",
    detail: "Médico",
    className: "bottom-[-4%] left-[-6%] z-20 w-[40%]",
    rotate: "rotate-3",
    delay: "0.7s",
  },
  {
    src: "/capsulas/capsula-malaga.webp",
    alt: "Cápsula solidaria real con un diorama de viajes entre Málaga y Göttingen",
    caption: "Viajes",
    detail: "Málaga ✈ Göttingen",
    className: "bottom-[2%] right-[0%] z-20 w-[37%]",
    rotate: "-rotate-3",
    delay: "1.7s",
  },
];

export function HeroCollage() {
  return (
    <div className="relative mx-auto aspect-[4/4.4] w-full max-w-md">
      {/* halo de fondo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-coral/15 via-amber/15 to-teal/15 blur-2xl"
      />

      {ITEMS.map((item) => (
        <figure
          key={item.src}
          className={`absolute ${item.className} animate-float-slow`}
          style={{ animationDelay: item.delay }}
        >
          <div
            className={`${item.rotate} overflow-hidden rounded-2xl border border-white/70 bg-white p-1.5 shadow-[0_18px_40px_-18px_rgba(38,34,30,0.45)] transition-transform duration-300 hover:scale-[1.04]`}
          >
            <div className="relative aspect-square overflow-hidden rounded-xl">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 260px, 45vw"
                className="object-cover"
                priority={item.priority}
              />
            </div>
            <figcaption className="flex items-baseline justify-between gap-2 px-1.5 pb-1 pt-1.5">
              <span className="truncate text-[11px] font-semibold text-ink">
                {item.caption}
              </span>
              {item.detail && (
                <span className="shrink-0 text-[10px] text-ink-soft">
                  {item.detail}
                </span>
              )}
            </figcaption>
          </div>
        </figure>
      ))}

      {/* sello de autenticidad */}
      <div className="absolute bottom-[30%] left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-cream shadow-lg">
        Cápsulas reales · Creadas con IA
      </div>
    </div>
  );
}
