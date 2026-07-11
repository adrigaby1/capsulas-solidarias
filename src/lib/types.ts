export type DonationStatus = "pending" | "paid" | "failed";

export interface Donation {
  id: string;
  stripe_session_id: string;
  amount_cents: number;
  currency: string;
  donor_email: string | null;
  status: DonationStatus;
  created_at: string;
}

export type SubmissionStatus = "pending" | "generating" | "ready" | "error";

export interface CapsuleFormData {
  // Identidad
  nombre: string;
  edad?: string;
  ciudad?: string;
  profesion?: string;

  // Personalidad y gustos
  hobbies?: string;
  deportes?: string;
  mascotas?: string;
  seriesFavoritas?: string;
  peliculasFavoritas?: string;
  videojuegosFavoritos?: string;
  coloresFavoritos?: string;
  paisFavorito?: string;
  suenos?: string;
  objetosImportantes?: string;
  fraseFavorita?: string;

  // Escenario y ocasión
  escenario: string;
  fechaEspecial?: string;
  celebracion?: string;
  motivo?: string;
  personaASorprender?: string;

  // Mensaje
  mensajeDedicatoria?: string;

  // Preferencias de campaña
  terremotoTheme?: boolean;
  galleryConsent?: boolean;
  showDonationAmount?: boolean;
}

export interface Submission {
  id: string;
  donation_id: string;
  photo_url: string;
  form_data: CapsuleFormData;
  status: SubmissionStatus;
  image_url: string | null;
  prompt: string | null;
  error_message?: string | null;
  gallery_consent?: boolean;
  created_at: string;
}
