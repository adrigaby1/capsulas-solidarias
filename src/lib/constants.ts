export const SITE = {
  name: "Cápsulas Solidarias",
  tagline: "Una imagen única. Una donación real. Miles de vidas ayudadas.",
  description:
    "Dona desde 1 € para ayudar a las víctimas del terremoto en Venezuela y recibe, como agradecimiento, tu propia cápsula Gashapon coleccionable generada con IA.",
  // Se toma de NEXT_PUBLIC_SITE_URL (configurada en Vercel) para que los
  // enlaces de compartir y la vista previa (Open Graph/WhatsApp) siempre
  // apunten al dominio real desplegado, sin tener que tocar este archivo
  // cada vez que cambie.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://capsulassolidarias.org",
  twitter: "@capsulasIA",
  supportEmail: "hola@capsulassolidarias.org",
} as const;

export const DONATION = {
  currency: "eur",
  minAmount: 1,
  suggestedAmounts: [1, 5, 10, 25, 50],
  defaultAmount: 10,
} as const;

// Entidad receptora de los fondos. Sustituir por el partner ONG real
// antes de salir a producción (ver README > "Antes de producción").
export const IMPACT_PARTNER = {
  name: "Cruz Roja Venezolana",
  description:
    "El 100% de lo recaudado se transfiere íntegramente a organizaciones humanitarias verificadas que trabajan sobre el terreno en las zonas afectadas por el terremoto.",
  url: "https://example.org",
};

// Organizaciones verificadas cuyo trabajo sobre el terreno respalda la
// promesa de transparencia de la campaña. Se muestran en la sección
// "Destino de las donaciones" para que la gente sepa que su ayuda se
// canaliza a través de entidades que ya están demostrando impacto real.
export const VERIFIED_PARTNERS = [
  {
    name: "Cruz Roja Venezolana",
    role: "Atención médica de emergencia",
    description:
      "Atención médica y primeros auxilios sobre el terreno en las zonas declaradas en emergencia tras el terremoto.",
    url: "https://www2.cruzroja.es/-/ayuda-terremoto-venezuela-2026",
  },
  {
    name: "Yummy",
    role: "Logística y ayuda humanitaria",
    description:
      "La superapp venezolana puso su red logística al servicio de la emergencia: recaudó 1.128.734 $ de 20.800 personas y 14 empresas (igualando el 25% de cada donación hasta 100.000 $), financiando el traslado desde México de 150 rescatistas, 3.600 bolsas para el centro de acopio de La Esmeralda y equipos de ultrasonido ya en uso en La Guaira.",
    url: "https://dona.yummyrides.com/",
  },
] as const;

export const IMPACT_BREAKDOWN = [
  {
    title: "Ayuda de emergencia",
    percent: 60,
    detail: "Agua, alimentos, mantas y kits de higiene para las familias afectadas.",
  },
  {
    title: "Atención médica",
    percent: 25,
    detail: "Medicamentos, material sanitario y apoyo a los equipos de emergencia.",
  },
  {
    title: "Reconstrucción",
    percent: 15,
    detail: "Refugios temporales y reconstrucción de viviendas básicas.",
  },
];

export const SCENARIO_OPTIONS = [
  "Cumpleaños",
  "Viajes",
  "Hospital",
  "Montaña",
  "Música",
  "Running",
  "Medicina",
  "Familia",
  "Docencia",
  "Enfermería",
  "Bomberos",
  "Mascotas",
  "Videojuegos",
  "Ciclismo",
  "Surf",
  "Naturaleza",
  "Oficina",
  "Concierto",
  "Bebé",
  "Boda",
  "Graduación",
  "Otro",
] as const;

export const FORM_STEPS = [
  "foto",
  "identidad",
  "personalidad",
  "escenario",
  "mensaje",
] as const;
