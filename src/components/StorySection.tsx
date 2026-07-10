import Image from "next/image";
import { Section, Eyebrow } from "@/components/ui/Section";

const GALLERY_PHOTOS = [
  {
    src: "/terremoto/escombros.webp",
    alt: "Equipos de rescate trabajando entre los escombros tras el terremoto en Venezuela",
    caption: "Equipos de rescate trabajando contra el reloj tras el sismo.",
  },
  {
    src: "/terremoto/edificio-caraballeda.jpg",
    alt: "Edificio residencial colapsado en Caraballeda tras el terremoto en Venezuela",
    caption: "Un edificio en Caraballeda, entre los muchos que no resistieron.",
  },
  {
    src: "/terremoto/bandera-rescate.webp",
    alt: "Bandera de Venezuela junto a labores de rescate entre los escombros",
    caption: "La bandera, presente en cada labor de rescate.",
  },
  {
    src: "/terremoto/comunidad-entre-escombros.jpg",
    alt: "Vecinos y equipos de rescate observando un edificio derrumbado en Venezuela",
    caption: "Vecinos y rescatistas, hombro a hombro frente a la pérdida.",
  },
  {
    src: "/terremoto/vigilia.webp",
    alt: "Vigilia con velas en solidaridad con las víctimas del terremoto en Venezuela",
    caption: "Vigilias en toda Venezuela en memoria de las víctimas.",
  },
  {
    src: "/terremoto/cruz-roja-rescate.jpg",
    alt: "Voluntarios de la Cruz Roja Venezolana y Protección Civil coordinando el rescate entre los escombros",
    caption: "La Cruz Roja Venezolana, presente desde la primera noche.",
  },
];

export function StorySection() {
  return (
    <Section id="historia" className="bg-white/40">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <Eyebrow>La historia</Eyebrow>
          <h2 className="font-display mt-5 text-3xl leading-tight md:text-4xl">
            Un terremoto lo cambió todo. Tu gesto puede cambiarlo de nuevo.
          </h2>
        </div>

        <div className="space-y-5 text-lg leading-relaxed text-ink-soft">
          <p>
            El 24 de junio de 2026, Venezuela sufrió un{" "}
            <strong className="text-ink">doblete sísmico</strong>: dos
            terremotos de magnitud 7,2 y 7,5 Mw, con apenas 39 segundos de
            diferencia entre ambos. Es el sismo más fuerte registrado en el
            país en más de un siglo, y ha dejado a miles de familias sin
            hogar, sin recuerdos, sin la sensación de seguridad de un techo
            propio.
          </p>
          <p>
            <strong className="text-ink">Cápsulas Solidarias</strong> nació
            de una idea sencilla: convertir cada donación, por pequeña que
            sea, en algo que se pueda sentir, guardar y compartir. No
            pedimos solo tu ayuda — te devolvemos un recuerdo hecho a tu
            medida, para que la solidaridad también se pueda abrazar.
          </p>
          <p>
            Cada cápsula que compartes en redes es una invitación silenciosa
            a que alguien más done. Así, un gesto de 1 € se multiplica en
            cientos de gestos más.
          </p>
        </div>
      </div>

      {/* Mapa de los dos epicentros: magnitud del doblete sísmico */}
      <div className="mt-16 grid gap-8 overflow-hidden rounded-3xl border border-ink/10 bg-white/60 p-6 md:grid-cols-[1.1fr_1fr] md:gap-10 md:p-10">
        <div className="overflow-hidden rounded-2xl bg-cream-dark/40">
          <Image
            src="/terremoto/mapa-epicentros.png"
            alt="Mapa con los dos epicentros del doblete sísmico del 24 de junio de 2026 en Venezuela, cerca de San Felipe (Yaracuy) y Yumare"
            width={1200}
            height={900}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark">
            Dos epicentros, un solo golpe
          </span>
          <h3 className="font-display mt-3 text-2xl leading-snug">
            7,2 y 7,5 Mw, a 39 segundos de distancia
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-ink-soft">
            <li>
              <strong className="text-ink">Primer sismo —</strong> magnitud
              7,2 Mw, a 23 km de San Felipe (estado Yaracuy), 20,3 km de
              profundidad.
            </li>
            <li>
              <strong className="text-ink">Segundo sismo —</strong> magnitud
              7,5 Mw, 39 segundos después, a 28 km al sureste de Yumare, 10
              km de profundidad.
            </li>
            <li>
              Un fenómeno poco frecuente conocido como{" "}
              <em>doblete sísmico</em>: dos terremotos de magnitud similar,
              casi simultáneos, que multiplican el daño frente a un único
              evento.
            </li>
          </ul>
          <p className="mt-5 text-xs text-ink-soft/70">
            Fuente: registros sismológicos del 24 de junio de 2026.
          </p>
        </div>
      </div>

      {/* Fotografías respetuosas de la respuesta humanitaria */}
      <div className="mt-8 grid gap-5 grid-cols-2 sm:grid-cols-3">
        {GALLERY_PHOTOS.map((photo) => (
          <figure
            key={photo.src}
            className="overflow-hidden rounded-2xl border border-ink/10 bg-white/50"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={480}
                height={360}
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="p-3 text-xs text-ink-soft">
              {photo.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
