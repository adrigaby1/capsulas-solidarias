import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Cliente de Supabase para el navegador. Usa la clave anónima (pública) y
 * respeta siempre las políticas de RLS. Solo se usa para lectura de estado
 * en tiempo real (p. ej. saber cuándo una cápsula ha terminado de generarse).
 */
export const supabaseBrowser =
  url && anonKey ? createClient(url, anonKey) : null;
