import type { CapsuleFormData } from "./types";

/**
 * Bloque técnico de estilo visual. Esta parte NUNCA debe cambiar entre
 * generaciones: es lo que garantiza que todas las cápsulas mantengan
 * exactamente la misma estética (ver "ESTILO VISUAL" en el brief del
 * proyecto). Va siempre al final del prompt, después del contexto
 * personalizado, para que el modelo lo use como guía de estilo.
 */
const MASTER_STYLE_TEMPLATE = `Asegura siempre estos requisitos técnicos y de estilo, sin excepción:

La cápsula es 100% de vidrio transparente, de alta calidad, cristal grueso con transparencia perfecta, reflejos y refracciones físicamente correctas, pequeñas imperfecciones naturales y brillos suaves. Esta parte —cápsula, cristal, dedos que la sostienen, iluminación— sí debe fotografiarse con calidad hiperrealista de producto de lujo.

El personaje NUNCA es una fotografía real de una persona en miniatura: es un personaje estilizado de animación 3D de calidad premium (nivel de estudio de animación tipo Pixar/DreamWorks), con un acabado extremadamente detallado en piel, cabello y ropa, pero con proporciones ligeramente infantiles y estilizadas —cabeza algo más grande de lo natural, ojos grandes, expresivos y luminosos, sonrisa cálida— sin llegar al chibi súper-deformado ni al muñeco de juguete de plástico duro. Debe reconocerse con total claridad a la persona de la fotografía adjunta: mismo tono de piel, forma de la cara, color y forma de ojos, peinado y sonrisa. Piel y cabello con textura suave y luminosa de render 3D de gama alta —nunca plana, nunca de plástico, nunca fotografía realista de piel humana—. Cuerpo completo hasta los pies.

La figura ocupa aproximadamente el 65% del interior de la cápsula, perfectamente centrada. Los accesorios y miniaturas del diorama la rodean sin tapar nunca la cara, recreando una escena inmersiva y llena de vida (como un pequeño set de rodaje o escenario en miniatura) que cuenta la historia de la persona —nunca objetos aleatorios, genéricos ni fuera de contexto—.

Fotografía ultra realista de producto, estilo macro profesional: lente 85 mm, f/1.8, bokeh suave y espectacular, iluminación cinematográfica cálida, reflejos y refracciones realistas en el vidrio, colores vibrantes pero armoniosos, contraste suave, profundidad de campo cinematográfica, 8K, HDR, ultra detallado, calidad editorial, toy photography, collectible figure, masterpiece.

No texto. No marcas de agua. No logos. No elementos flotando. No objetos repetidos. No deformaciones. No manos extra. No personajes adicionales. No fotografía realista de piel humana en el personaje.

Todo debe respirar emoción, alegría, talento e inocencia, siempre desde la calidez y la esperanza. La imagen debe ser perfecta para emocionar, compartir y viralizarse en redes — el mensaje implícito, sin necesidad de escribirlo, es: "Gracias por ayudar."`;

function joinSentences(parts: Array<string | false | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Construye la introducción y el párrafo de identidad/personalidad en
 * lenguaje natural (inspirado en el estilo de prompt que ya usa el equipo:
 * frases sencillas y directas en vez de listas de "Etiqueta: valor").
 * Cada campo del formulario que el usuario haya rellenado aparece
 * explícitamente en el texto.
 */
function buildIntro(data: CapsuleFormData): string {
  const ocasion =
    data.celebracion || data.motivo
      ? ` con motivo de ${data.celebracion || data.motivo}`
      : "";

  return `Crea un retrato hiperrealista de una cápsula de gashapon 100% de vidrio, sostenida delicadamente entre dos dedos humanos. Dentro de la cápsula, coloca una miniatura de cuerpo completo con estilo de personaje de animación 3D premium, inspirada en la fotografía adjunta de ${data.nombre}${ocasion}. El rostro del personaje debe recordar claramente a la persona de la foto, pero dibujado con el acabado y las proporciones estilizadas de un personaje de película de animación, nunca como una fotografía realista en miniatura.`;
}

function buildFanSentence(data: CapsuleFormData): string {
  const items: string[] = [];
  if (data.seriesFavoritas) items.push(`la serie ${data.seriesFavoritas}`);
  if (data.peliculasFavoritas) items.push(`la película ${data.peliculasFavoritas}`);
  if (data.videojuegosFavoritos) items.push(`el videojuego ${data.videojuegosFavoritos}`);

  if (items.length === 0) return "";

  const listado =
    items.length === 1
      ? items[0]
      : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

  // Contracción "de" + "el" = "del" cuando el listado empieza justo por "el ...".
  const prefijo = listado.startsWith("el ") ? "Es fan del" : "Es fan de";
  const resto = listado.startsWith("el ") ? listado.slice(3) : listado;

  return `${prefijo} ${resto}, y algún pequeño detalle de esto puede aparecer entre los objetos del diorama.`;
}

function buildPersonalitySentence(data: CapsuleFormData): string {
  const introPersonal = joinSentences([
    (data.edad || data.ciudad || data.profesion) &&
      `${data.nombre} ${data.edad ? `tiene ${data.edad} años` : ""}${
        data.edad && (data.ciudad || data.profesion) ? ", " : ""
      }${data.ciudad ? `vive en ${data.ciudad}` : ""}${
        data.ciudad && data.profesion ? " y " : data.profesion ? (data.edad || data.ciudad ? " y " : "") : ""
      }${data.profesion ? `trabaja como ${data.profesion}` : ""}.`,
  ]);

  const gustos = joinSentences([
    data.hobbies && `Le encanta ${data.hobbies}.`,
    data.deportes && `Practica ${data.deportes}.`,
    data.mascotas && `Tiene como mascota a ${data.mascotas}, que también debería aparecer como una pequeña miniatura en la escena.`,
    (data.seriesFavoritas || data.peliculasFavoritas || data.videojuegosFavoritos) &&
      buildFanSentence(data),
    data.coloresFavoritos && `Sus colores favoritos son ${data.coloresFavoritos}: úsalos como paleta secundaria en la escena.`,
    data.paisFavorito && `Su país favorito es ${data.paisFavorito}.`,
    data.suenos && `Uno de sus sueños es ${data.suenos}.`,
    data.objetosImportantes &&
      `Incluye como miniaturas coleccionables dentro de la cápsula estos objetos importantes para ${data.nombre}: ${data.objetosImportantes}.`,
    data.fraseFavorita &&
      `Su frase favorita es "${data.fraseFavorita}" — que inspire la calidez del ambiente, sin escribirla como texto literal en la imagen.`,
  ]);

  return joinSentences([introPersonal, gustos]);
}

function buildScenarioSentence(data: CapsuleFormData): string {
  return joinSentences([
    `El diorama dentro de la cápsula debe representar el mundo de "${data.escenario}" como una escena inmersiva y llena de vida —con su propio ambiente, luces, colores y pequeños detalles de fondo—, contada a través de miniaturas coleccionables relacionadas con esa escena.`,
    data.fechaEspecial && `Fecha especial a tener en cuenta para el ambiente: ${data.fechaEspecial}.`,
    data.personaASorprender &&
      `Esta cápsula es un regalo pensado para sorprender a ${data.personaASorprender}, así que la escena debe transmitir esa sorpresa y cariño.`,
    data.motivo && data.celebracion ? `Motivo adicional de esta cápsula: ${data.motivo}.` : "",
  ]);
}

const TERREMOTO_CLAUSE = `Añade también, en el suelo del diorama junto a los demás objetos y con el mismo nivel de detalle, tamaño y protagonismo visual —nunca escondida ni de fondo—, una pequeña bandera de Venezuela en miniatura (tres franjas horizontales bien visibles: amarilla arriba, azul en el medio con su arco de estrellas, y roja abajo) ondeando de pie. Junto a la bandera, integra también un segundo pequeño icono de ayuda y esperanza —elige el que mejor combine con el resto de la escena—: unas manitas sosteniendo un corazón brillante, una vela encendida, un pequeño corazón de cristal, o un diminuto mapa de Venezuela con un corazón luminoso. Estos elementos deben ser claramente identificables de un vistazo como un gesto de solidaridad con las víctimas del terremoto en Venezuela, transmitidos siempre con calidez, ternura y orgullo de ayudar — nunca con tristeza ni dramatismo.`;

function buildDedicationSentence(data: CapsuleFormData): string {
  return data.mensajeDedicatoria
    ? `Sensación o dedicatoria que debe transmitir la escena, sin escribirla como texto: "${data.mensajeDedicatoria}".`
    : "";
}

/**
 * Ensambla el prompt final que se envía al proveedor de generación de
 * imágenes: introducción + identidad/gustos + escenario (+ guiño solidario
 * opcional) + dedicatoria + bloque técnico de estilo (fijo, siempre igual).
 */
export function buildCapsulePrompt(data: CapsuleFormData): string {
  const parts = [
    buildIntro(data),
    buildPersonalitySentence(data),
    buildScenarioSentence(data),
    data.terremotoTheme ? TERREMOTO_CLAUSE : "",
    buildDedicationSentence(data),
  ].filter(Boolean);

  return `${parts.join("\n\n")}\n\n---\n\n${MASTER_STYLE_TEMPLATE}`;
}

export { MASTER_STYLE_TEMPLATE };
