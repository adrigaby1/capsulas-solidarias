import { Section, Eyebrow } from "@/components/ui/Section";
import { InstagramEmbed } from "@/components/InstagramEmbed";

const REELS = [
  {
    url: "https://www.instagram.com/reel/DaXB9IpSNmM/",
    author: "@yulburkle",
    description: "Un relato de la situación vivida tras el terremoto.",
  },
  {
    url: "https://www.instagram.com/reel/DaAWWiuNqHt/",
    author: "@jeremiasloscher",
    description: "Un reportaje documental sobre la magnitud de lo ocurrido en Venezuela.",
  },
];

export function TestimonialsSection() {
  return (
    <Section id="testimonios" className="bg-cream-dark/30">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Voces desde Venezuela</Eyebrow>
        <h2 className="font-display mt-5 text-3xl leading-tight md:text-4xl">
          Para entender por qué importa cada donación
        </h2>
        <p className="mt-4 text-ink-soft">
          Dos relatos que muestran, mejor que cualquier cifra, lo que está
          pasando sobre el terreno.
        </p>
      </div>

      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        {REELS.map((reel) => (
          <div key={reel.url} className="flex flex-col items-center gap-4">
            <InstagramEmbed url={reel.url} />
            <p className="max-w-sm text-center text-sm text-ink-soft">
              {reel.description}
              <br />
              <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-teal-dark hover:underline"
              >
                Vídeo de {reel.author}
              </a>
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
