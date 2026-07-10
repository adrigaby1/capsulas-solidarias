import { getSupabaseServiceClient } from "./supabase/server";
import type { CapsuleFormData } from "./types";

export interface GalleryItem {
  id: string;
  imageUrl: string;
  nombre: string;
  escenario: string;
  createdAt: string;
}

/**
 * Devuelve las cápsulas listas (status = "ready") cuyo autor ha dado su
 * consentimiento explícito para aparecer en la galería pública
 * (gallery_consent = true). Solo se exponen el nombre, el escenario y la
 * imagen final — nunca la foto original ni el resto del formulario.
 */
export async function getGalleryItems(limit = 60): Promise<GalleryItem[]> {
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("id, image_url, form_data, created_at")
      .eq("status", "ready")
      .eq("gallery_consent", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data ?? [])
      .filter((row) => row.image_url)
      .map((row) => {
        const formData = row.form_data as CapsuleFormData;
        return {
          id: row.id,
          imageUrl: row.image_url as string,
          nombre: formData?.nombre ?? "Alguien solidario",
          escenario: formData?.escenario ?? "",
          createdAt: row.created_at,
        };
      });
  } catch {
    return [];
  }
}
