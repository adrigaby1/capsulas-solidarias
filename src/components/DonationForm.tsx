"use client";

import { useState } from "react";
import { DONATION } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Loader2, ShieldCheck } from "lucide-react";

export function DonationForm() {
  const [amount, setAmount] = useState<number>(DONATION.defaultAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!effectiveAmount || effectiveAmount < DONATION.minAmount) {
      setError(`El importe mínimo es ${DONATION.minAmount} €.`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: effectiveAmount, email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Ha ocurrido un error inesperado.");
        setLoading(false);
        return;
      }

      window.location.href = json.url;
    } catch {
      setError("No se ha podido conectar con el servidor de pagos.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <p className="mb-3 text-sm font-medium text-ink">Elige un importe</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {DONATION.suggestedAmounts.map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => {
                setAmount(value);
                setCustomAmount("");
              }}
              className={cn(
                "rounded-2xl border py-3 text-sm font-medium transition-all",
                !customAmount && amount === value
                  ? "border-coral bg-coral text-white shadow-md"
                  : "border-ink/10 bg-white/60 text-ink hover:border-ink/25"
              )}
            >
              {value} €
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label className="text-xs text-ink-soft">Otro importe</label>
          <div className="mt-1 flex items-center rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 focus-within:border-ink/30">
            <input
              type="number"
              min={DONATION.minAmount}
              step="1"
              placeholder="Ej. 15"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full bg-transparent text-sm outline-none"
            />
            <span className="text-sm text-ink-soft">EUR</span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink">Email (opcional)</label>
        <p className="mt-1 text-xs text-ink-soft">
          Te lo pediremos también en el formulario de personalización. Solo lo
          usamos para enviarte el recibo y el enlace a tu cápsula.
        </p>
        <input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-ink/10 bg-white/60 px-4 py-3 text-sm outline-none focus:border-ink/30"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-dark">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Conectando con el pago seguro…
          </>
        ) : (
          `Donar ${effectiveAmount || 0} € y continuar`
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-ink-soft">
        <ShieldCheck className="h-3.5 w-3.5" />
        Pago 100% seguro procesado por Stripe. No almacenamos tus datos de tarjeta.
      </p>
    </form>
  );
}
