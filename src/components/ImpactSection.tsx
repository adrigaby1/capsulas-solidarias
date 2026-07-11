import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { IMPACT_BREAKDOWN, IMPACT_PARTNER, VERIFIED_PARTNERS } from "@/lib/constants";
import { formatEuros } from "@/lib/utils";
import { getImpactStats } from "@/lib/stats";
import { ShieldCheck, ExternalLink } from "lucide-react";

export async function ImpactSection() {
  const stats = await getImpactStats();

  return (
    <Section id="destino" className="bg-ink text-cream">
      <div className="grid gap-16 md:grid-cols-2">
        <div>
          <Eyebrow>Destino de las donaciones</Eyebrow>
          <h2 className="font-display mt-5 text-3xl leading-tight md:text-4xl">
            Cada euro cuenta. Y puedes verlo.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-cream/70">
            {IMPACT_PARTNER.description} Trabajamos con{" "}
            <span className="text-cream">{IMPACT_PARTNER.name}</span> para
            garantizar que la ayuda llega a quien la necesita.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-6">
            <div>
              <p className="font-display text-4xl">{formatEuros(stats.totalCents)}</p>
              <p className="mt-1 text-sm text-cream/60">recaudados hasta ahora</p>
            </div>
            <div>
              <p className="font-display text-4xl">{stats.donorCount.toLocaleString("es-ES")}</p>
              <p className="mt-1 text-sm text-cream/60">cápsulas creadas</p>
            </div>
          </div>

          {!stats.configured && (
            <p className="mt-6 flex items-center gap-2 text-xs text-cream/40">
              <ShieldCheck className="h-3.5 w-3.5" />
              Cifras de ejemplo — se mostrarán datos reales en cuanto Supabase esté conectado.
            </p>
          )}

          <Button href="/donar" variant="primary" className="mt-8">
            Quiero ayudar
          </Button>
        </div>

        <div className="space-y-6">
          {IMPACT_BREAKDOWN.map((item) => (
            <div key={item.title}>
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-cream">{item.title}</span>
                <span className="text-cream/50">{item.percent}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-cream/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber to-coral"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-cream/50">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t border-cream/10 pt-12">
        <Eyebrow>Organizaciones verificadas</Eyebrow>
        <p className="mt-4 max-w-2xl text-sm text-cream/60">
          No trabajamos solos. Estas son organizaciones cuyo trabajo sobre el
          terreno ya está demostrando impacto real — para que sepas que tu
          ayuda se canaliza a través de entidades que en verdad están
          ayudando.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {VERIFIED_PARTNERS.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-cream/10 bg-cream/5 p-6 transition-colors hover:border-cream/25 hover:bg-cream/10"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-lg text-cream">{partner.name}</h3>
                <ExternalLink className="h-4 w-4 shrink-0 text-cream/40 transition-colors group-hover:text-cream/70" />
              </div>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-coral/80">
                {partner.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                {partner.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
