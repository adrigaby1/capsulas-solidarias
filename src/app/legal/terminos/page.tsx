import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/constants";

export const metadata = { title: "Términos" };

export default function TerminosPage() {
  return (
    <Container className="max-w-2xl py-16">
      <h1 className="font-display text-3xl">Términos de uso</h1>
      <div className="mt-8 space-y-5 text-sm leading-relaxed text-ink-soft">
        <p>
          {SITE.name} es una iniciativa solidaria, no un producto comercial.
          Las donaciones son voluntarias y no reembolsables, salvo error
          técnico verificado.
        </p>
        <p>
          La cápsula generada por IA es un agradecimiento simbólico por tu
          colaboración, no una contraprestación comercial. Su generación
          puede tardar varios minutos y, en casos excepcionales, no
          completarse por limitaciones técnicas del proveedor de IA.
        </p>
        <p>
          Al subir tu fotografía, confirmas que tienes derecho a usarla y
          autorizas su uso exclusivamente para generar tu cápsula
          personalizada.
        </p>
        <p className="text-xs text-ink-soft/70">
          Documento de ejemplo — sustituir por el texto legal definitivo
          antes de salir a producción.
        </p>
      </div>
    </Container>
  );
}
