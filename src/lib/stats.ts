import { getSupabaseServiceClient } from "./supabase/server";

export interface ImpactStats {
  totalCents: number;
  donorCount: number;
  configured: boolean;
}

/**
 * Lee el total recaudado y el número de donantes directamente de Supabase.
 * Si Supabase no está configurado todavía (p. ej. en un entorno de
 * desarrollo recién clonado), devuelve datos de ejemplo con
 * `configured: false` para que la UI pueda mostrar un aviso discreto.
 */
export async function getImpactStats(): Promise<ImpactStats> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { totalCents: 128450, donorCount: 342, configured: false };
  }

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("donations")
      .select("amount_cents")
      .eq("status", "paid");

    if (error) throw error;

    const totalCents = (data ?? []).reduce((sum, row) => sum + row.amount_cents, 0);

    return {
      totalCents,
      donorCount: data?.length ?? 0,
      configured: true,
    };
  } catch {
    return { totalCents: 0, donorCount: 0, configured: true };
  }
}
