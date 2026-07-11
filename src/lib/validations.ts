import { z } from "zod";
import { DONATION } from "./constants";

export const donationAmountSchema = z.object({
  amount: z
    .number({ message: "Introduce un importe válido." })
    .min(DONATION.minAmount, `El importe mínimo es ${DONATION.minAmount} €.`)
    .max(10000, "Para importes superiores a 10.000 €, contacta con nosotros directamente."),
  email: z.string().email("Introduce un email válido.").optional().or(z.literal("")),
});

export type DonationAmountInput = z.infer<typeof donationAmountSchema>;

export const capsuleFormSchema = z.object({
  nombre: z.string().min(1, "Cuéntanos cómo te llamas.").max(60),
  edad: z.string().max(10).optional().or(z.literal("")),
  ciudad: z.string().max(80).optional().or(z.literal("")),
  profesion: z.string().max(80).optional().or(z.literal("")),

  hobbies: z.string().max(200).optional().or(z.literal("")),
  deportes: z.string().max(150).optional().or(z.literal("")),
  mascotas: z.string().max(150).optional().or(z.literal("")),
  seriesFavoritas: z.string().max(150).optional().or(z.literal("")),
  peliculasFavoritas: z.string().max(150).optional().or(z.literal("")),
  videojuegosFavoritos: z.string().max(150).optional().or(z.literal("")),
  coloresFavoritos: z.string().max(100).optional().or(z.literal("")),
  paisFavorito: z.string().max(80).optional().or(z.literal("")),
  suenos: z.string().max(300).optional().or(z.literal("")),
  objetosImportantes: z.string().max(200).optional().or(z.literal("")),
  fraseFavorita: z.string().max(200).optional().or(z.literal("")),

  escenario: z.string().min(1, "Elige el escenario que mejor representa tu historia."),
  fechaEspecial: z.string().max(60).optional().or(z.literal("")),
  celebracion: z.string().max(120).optional().or(z.literal("")),
  motivo: z.string().max(300).optional().or(z.literal("")),
  personaASorprender: z.string().max(120).optional().or(z.literal("")),

  mensajeDedicatoria: z.string().max(400).optional().or(z.literal("")),

  terremotoTheme: z.boolean().optional(),
  galleryConsent: z.boolean().optional(),
  showDonationAmount: z.boolean().optional(),
});

export type CapsuleFormInput = z.infer<typeof capsuleFormSchema>;

export const MAX_PHOTO_SIZE_MB = 10;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

// Vercel rechaza a nivel de plataforma (antes de que nuestro código llegue a
// ejecutarse) cualquier petición a una Serverless Function con un cuerpo de
// más de ~4,5 MB. Como el formulario va como multipart/form-data junto al
// resto de campos, dejamos un margen de seguridad claro por debajo de ese
// límite para el archivo ya comprimido que se sube de verdad.
export const MAX_UPLOAD_SIZE_MB = 4;
