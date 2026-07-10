export const SITE = {
  name: "Cápsulas Solidarias",
  tagline: "Una imagen única. Una donación real. Miles de vidas ayudadas.",
  description:
    "Dona desde 1 € para ayudar a las víctimas del terremoto en Venezuela y recibe, como agradecimiento, tu propia cápsula Gashapon coleccionable generada con IA.",
  url: "https://capsulassolidarias.org",
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
