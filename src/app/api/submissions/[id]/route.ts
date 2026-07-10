import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("id, status, image_url, error_message, form_data")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Cápsula no encontrada." }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno todavía." },
      { status: 503 }
    );
  }
}
