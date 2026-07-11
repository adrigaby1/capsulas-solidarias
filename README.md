# Cápsulas Solidarias

Plataforma de donaciones solidarias para ayudar a las víctimas del terremoto
en Venezuela. Cada donante recibe, como agradecimiento, una cápsula Gashapon
coleccionable generada con IA a partir de su fotografía.

Stack: **Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Stripe ·
Supabase (Postgres + Storage) · OpenAI Images (gpt-image-1.5) · Vercel**.

## Flujo del producto

```
Inicio → Historia → Destino de las donaciones → Donar (importe libre, desde 1 €)
  → Pago con Stripe → Formulario de personalización + foto
  → Generación de imagen con IA → Descarga → Compartir → Galería pública (opcional)
```

## Novedades

- **Prompt en lenguaje natural**: `src/lib/prompt-builder.ts` construye el
  prompt como frases (no listas de "Etiqueta: valor"), incorporando
  explícitamente cada campo que la persona haya rellenado.
- **Guiño solidario opcional**: casilla en el último paso del formulario
  ("quiero que mi cápsula incluya un guiño solidario al terremoto de
  Venezuela") que añade una instrucción extra al prompt para incluir un
  detalle visual de solidaridad (bandera, corazón, cinta) de forma sutil.
- **Galería pública**: casilla de consentimiento en el formulario + página
  `/galeria` que muestra las cápsulas de quienes han dado su permiso
  explícito. Solo se muestran la imagen final, el nombre y el escenario —
  nunca la foto original ni el resto de respuestas del formulario.
- **Compartir en Instagram**: botón en la página de resultado que, en móvil,
  abre la hoja de compartir nativa con la propia imagen (para subirla a
  Stories/Feed), y en escritorio copia el texto y abre Instagram.

## 1. Requisitos

- Node.js 20+
- Una cuenta de [Stripe](https://stripe.com)
- Un proyecto de [Supabase](https://supabase.com)
- Una API key de [OpenAI](https://platform.openai.com) con acceso al modelo `gpt-image-1.5`
  (o adapta `src/lib/image-generation.ts` para usar otro proveedor)

## 2. Instalación local

```bash
npm install
cp .env.example .env.local
# rellena .env.local con tus claves (ver sección 3)
npm run dev
```

Abre http://localhost:3000

**Importante:** trabaja siempre en una copia del proyecto fuera de carpetas
sincronizadas (OneDrive, Google Drive, Dropbox…). La sincronización en tiempo
real compite con Next.js por el disco y puede volver la compilación
extremadamente lenta (minutos en vez de segundos).

## 3. Configuración de servicios

### Stripe

1. Crea una cuenta / usa el modo test.
2. Copia tu **Secret key** en `STRIPE_SECRET_KEY`.
3. Para el webhook en local: `stripe listen --forward-to localhost:3000/api/stripe-webhook`
   y copia el `whsec_...` que te da en `STRIPE_WEBHOOK_SECRET`.
4. En producción, crea un endpoint de webhook en el dashboard de Stripe
   apuntando a `https://tu-dominio.com/api/stripe-webhook`, escuchando el
   evento `checkout.session.completed`.

### Supabase

1. Crea un proyecto nuevo (o usa uno existente).
2. Ve a **SQL Editor** y ejecuta el contenido de `supabase/schema.sql`.
   Es seguro volver a ejecutarlo aunque ya tengas las tablas creadas: usa
   `create table if not exists` y `add column if not exists`, así que solo
   añade lo que falte (por ejemplo, la columna `gallery_consent` si tu
   proyecto es anterior a la función de galería pública).
3. Ve a **Storage** y crea dos buckets **públicos** (solo lectura pública,
   escritura restringida a la service role):
   - `capsule-photos`
   - `capsule-results`
4. Copia `Project URL`, `anon public key` y `service_role key` desde
   **Project Settings > API** a tu `.env.local`.

### OpenAI (generación de imágenes)

1. Genera una API key en https://platform.openai.com/api-keys.
2. Añádela como `OPENAI_API_KEY`.
3. En **Settings > Billing**, añade un método de pago y sube el límite de
   gasto ("usage limit") — por defecto puede estar en 0 $ y bloquear todas
   las generaciones con el error `billing_hard_limit_reached`.
4. Si prefieres otro proveedor (Midjourney, Stability, Replicate…),
   solo tienes que reimplementar `generateCapsuleImage` en
   `src/lib/image-generation.ts` — el resto de la aplicación no cambia.

Coste orientativo: con `gpt-image-1` en calidad alta, cada cápsula costaba
aproximadamente 0,15-0,20 $ (ese modelo se retira el 23 de octubre de 2026).
Ahora se usa `gpt-image-1.5`, su sucesor directo (mismo endpoint y parámetros);
revisa el coste real de las primeras cápsulas generadas con él en tu panel de
OpenAI (Settings > Usage) para ajustar tu límite de facturación al volumen de
donaciones esperado.

## 4. Despliegue en Vercel

1. Sube el repositorio a GitHub/GitLab.
2. Importa el proyecto en [Vercel](https://vercel.com/new).
3. Añade todas las variables de `.env.example` en **Project Settings > Environment Variables**.
4. Despliega. Actualiza la URL del webhook de Stripe con el dominio final.

## 5. Estructura del proyecto

```
src/
  app/
    page.tsx                  Landing (Inicio, Historia, Destino, CTA)
    donar/                    Paso 1: elegir importe y pagar
    crea-tu-capsula/          Paso 2: foto + formulario de personalización
    capsula/[id]/             Paso 3: resultado, descarga y compartir
    galeria/                  Galería pública de cápsulas con consentimiento
    api/
      checkout/               Crea la sesión de Stripe Checkout
      stripe-webhook/         Confirma el pago y registra la donación
      donations/[sessionId]/  Consulta el estado de una donación
      submissions/            Sube la foto, guarda el formulario y lanza la generación
      submissions/[id]/       Consulta el estado/resultado de una cápsula
      generate-image/         Reintenta la generación de una cápsula
  components/                 UI (Hero, formularios, resultado, etc.)
  lib/
    prompt-builder.ts         Construye el prompt en lenguaje natural a partir del formulario
    image-generation.ts       Llama al proveedor de IA (OpenAI por defecto)
    generate-and-store.ts     Orquesta generación + subida a Supabase Storage
    gallery.ts                Consulta las cápsulas públicas para /galeria
    stripe.ts, supabase/      Clientes de Stripe y Supabase
supabase/schema.sql           Esquema de base de datos (con migraciones idempotentes)
```

## 6. El prompt de IA (estilo visual)

El estilo de todas las cápsulas se mantiene siempre idéntico gracias al
bloque técnico fijo definido en `src/lib/prompt-builder.ts`
(`MASTER_STYLE_TEMPLATE`), que va siempre al final del prompt y nunca
cambia. Delante de ese bloque se construye, en lenguaje natural, el
contexto personalizado a partir de cada respuesta del formulario
(identidad, gustos, escenario, guiño solidario opcional y dedicatoria). Si
en algún momento se quiere ajustar el estilo visual de marca, ese bloque
fijo es el único lugar del código donde debe tocarse.

## 7. Antes de salir a producción

Este scaffold está listo para funcionar, pero antes de aceptar donaciones
reales revisa:

- [ ] Sustituir `IMPACT_PARTNER` en `src/lib/constants.ts` por la ONG/entidad
      receptora real de los fondos, con sus datos legales verificados.
- [ ] Revisar y sustituir los textos de `src/app/legal/privacidad` y
      `src/app/legal/terminos` por textos legales definitivos (RGPD).
- [ ] Pasar Stripe a modo live y verificar la cuenta.
- [ ] Configurar políticas de Storage en Supabase (tamaño máx. de archivo,
      tipos de archivo permitidos) además de la validación ya existente en el cliente/servidor.
- [ ] Añadir moderación de contenido en las fotos subidas si el volumen lo requiere.
- [ ] Configurar un dominio propio y actualizar `SITE.url` en `src/lib/constants.ts`.
- [ ] Revisar límites de coste del proveedor de IA (cada generación tiene un coste por imagen).

## 8. Identidad visual

Este proyecto usa una identidad visual **propia e independiente**
("Cápsulas Solidarias"): tipografía Fraunces + Inter y una paleta cálida
(crema, ámbar, coral, verde azulado). El icono de marca —una cápsula
partida en dos mitades, con una persona en la parte superior y un corazón
en la inferior— vive en `src/app/icon.svg` (favicon) y como componente en
`src/components/BrandIcon.tsx` (logotipo en la interfaz). Se inspira en el
espíritu de cercanía, confianza y cuidado de una comunicación sanitaria/de
bienestar, pero no
reproduce el logotipo ni los colores corporativos exactos de ninguna marca
de terceros.
