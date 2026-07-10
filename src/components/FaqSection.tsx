import { Section, Eyebrow } from "@/components/ui/Section";

const FAQS = [
  {
    q: "¿A dónde va exactamente mi dinero?",
    a: "El 100% de cada donación se transfiere a organizaciones humanitarias verificadas que trabajan directamente en las zonas afectadas por el terremoto en Venezuela. Puedes ver el desglose de uso de fondos en la sección de transparencia.",
  },
  {
    q: "¿Cuánto tarda en generarse mi cápsula?",
    a: "Normalmente entre 2 y 5 minutos tras completar el formulario. Te avisaremos en pantalla en cuanto esté lista para descargar.",
  },
  {
    q: "¿Qué pasa con la foto que subo?",
    a: "Se usa exclusivamente para generar tu figura personalizada y se almacena de forma segura. No se comparte con terceros ni se usa con otro fin.",
  },
  {
    q: "¿Puedo donar sin subir foto?",
    a: "Sí. La donación es completamente independiente de la cápsula: puedes ayudar aunque no quieras generar tu imagen personalizada.",
  },
  {
    q: "¿Es esto una iniciativa comercial?",
    a: "No. Cápsulas Solidarias es un proyecto solidario e independiente. No vendemos ningún producto: la cápsula es un agradecimiento simbólico por tu donación.",
  },
];

export function FaqSection() {
  return (
    <Section id="preguntas">
      <div className="text-center">
        <Eyebrow>Preguntas frecuentes</Eyebrow>
        <h2 className="font-display mx-auto mt-5 max-w-xl text-3xl leading-tight md:text-4xl">
          Transparencia, ante todo
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-2xl divide-y divide-ink/8">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink">
              {item.q}
              <span className="ml-4 text-ink-soft transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
