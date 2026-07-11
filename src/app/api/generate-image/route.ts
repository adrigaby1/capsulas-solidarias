import { NextRequest, NextResponse, after } from "next/server";
import { runImageGeneration } from "@/lib/generate-and-store";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Permite reintentar la generación de una cápsula (p. ej. si la primera
 * llamada falló por un error transitorio del proveedor de IA). Se llama
 * desde el botón "Reintentar" en /capsula/[id] cuando status === "error".
 *
 * Igual que en /api/submissions, la generación se lanza en segundo plano
 * con after() en vez de bloquear la respuesta HTTP: el cliente vuelve a
 * sondear el estado con el mismo mecanismo de poll que usa la primera vez.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const submissionId = body?.submissionId as string | undefined;

  if (!submissionId) {
    return NextResponse.json({ error: "Falta submissionId." }, { status: 400 });
  }

  after(() =>
    runImageGeneration(submissionId).catch((error) => {
      console.error("[generate-image] Error reintentando la generación:", error);
    })
  );

  return NextResponse.json({ ok: true });
}
