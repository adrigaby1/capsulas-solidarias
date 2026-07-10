import { NextRequest, NextResponse } from "next/server";
import { runImageGeneration } from "@/lib/generate-and-store";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Permite reintentar la generación de una cápsula (p. ej. si la primera
 * llamada falló por un error transitorio del proveedor de IA). Se llama
 * desde el botón "Reintentar" en /capsula/[id] cuando status === "error".
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const submissionId = body?.submissionId as string | undefined;

  if (!submissionId) {
    return NextResponse.json({ error: "Falta submissionId." }, { status: 400 });
  }

  try {
    await runImageGeneration(submissionId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
