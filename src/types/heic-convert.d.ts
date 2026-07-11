// "heic-convert" no publica tipos oficiales; declaramos aquí lo mínimo que
// usamos (ver src/lib/normalize-image.ts).
declare module "heic-convert" {
  interface HeicConvertOptions {
    buffer: Buffer;
    format: "JPEG" | "PNG";
    quality?: number;
  }

  export default function convert(options: HeicConvertOptions): Promise<Buffer>;
}
