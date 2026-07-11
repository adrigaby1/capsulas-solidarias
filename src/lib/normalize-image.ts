import sharp from "sharp";
import heicConvert from "heic-convert";

/**
 * Normaliza cualquier fotografía subida por el usuario a un PNG "limpio"
 * antes de enviarla a la API de imágenes de OpenAI.
 *
 * Motivo: OpenAI devuelve `invalid_image_file` (400) con algunas fotos de
 * iPhone. La causa exacta varía según el dispositivo/versión de iOS, pero
 * las culpables habituales son:
 *   - Archivos HEIC/HEIF reales (Safari no siempre los transcodifica a JPEG
 *     antes de subirlos, según la configuración de la cámara del usuario).
 *   - Perfiles de color no-sRGB (Display P3, CMYK) que OpenAI no acepta.
 *   - Canal alfa o metadatos EXIF de orientación inusuales.
 *
 * En vez de intentar detectar cuál de estos causó un fallo concreto,
 * normalizamos SIEMPRE cualquier imagen (venga de iPhone, Android o
 * escritorio) al mismo formato conocido-bueno: PNG, sRGB, sin alfa,
 * orientada correctamente y con un tamaño máximo razonable.
 */
export async function normalizeReferenceImage(
  input: Buffer,
  declaredType?: string
): Promise<{ buffer: Buffer; contentType: string; filename: string }> {
  let workingBuffer = input;

  if (looksLikeHeic(input, declaredType)) {
    try {
      workingBuffer = await heicConvert({ buffer: input, format: "JPEG", quality: 0.92 });
    } catch (err) {
      // Si la conversión falla, seguimos e intentamos que sharp la procese
      // igualmente (algunos archivos "casi HEIC" son en realidad JPEG).
      console.error("[normalize-image] Fallo convirtiendo HEIC a JPEG:", err);
    }
  }

  const buffer = await sharp(workingBuffer)
    .rotate() // aplica la orientación EXIF antes de que se pierdan los metadatos
    .flatten({ background: "#ffffff" }) // fuerza fondo opaco: evita canal alfa/CMYK problemáticos
    .toColourspace("srgb")
    .resize({ width: 1536, height: 1536, fit: "inside", withoutEnlargement: true })
    .png()
    .toBuffer();

  return { buffer, contentType: "image/png", filename: "foto.png" };
}

const HEIC_BRANDS = ["heic", "heix", "hevc", "heim", "hevx", "mif1", "msf1"];

function looksLikeHeic(buffer: Buffer, declaredType?: string): boolean {
  if (declaredType && /hei[cf]/i.test(declaredType)) return true;
  if (buffer.length < 12) return false;

  const boxType = buffer.toString("ascii", 4, 8);
  if (boxType !== "ftyp") return false;

  const brand = buffer.toString("ascii", 8, 12).toLowerCase();
  return HEIC_BRANDS.includes(brand);
}
