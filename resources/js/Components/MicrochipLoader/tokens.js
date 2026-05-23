// ─── Design Tokens ────────────────────────────────────────────────────────────
// Colores del sistema de microchip
export const GREEN = "rgb(22, 163, 74)";
export const LIME  = "rgb(167, 243, 20)";

// Pasos del loader
export const LOADER_STEPS = [
  "Iniciando sistema...",
  "Preparando inyectadora...",
  "Cargando microchip...",
  "Verificando datos...",
  "Registrando mascota...",
];

// Total de patitas en la barra de progreso
export const PAW_COUNT = 7;

// CSS de animaciones global (se inyecta una sola vez en el organismo)
export const LOADER_ANIMATIONS = `
  @keyframes ringSpinAnim {
    to { transform: rotate(360deg); transform-origin: 160px 160px; }
  }
  @keyframes ringSpinReverseAnim {
    to { transform: rotate(-360deg); transform-origin: 160px 160px; }
  }
  @keyframes floatAnim {
    0%, 100% { transform: rotate(-45deg) translateY(0px); }
    50%       { transform: rotate(-45deg) translateY(-10px); }
  }
  @keyframes scanAnim {
    0%   { top: 20%; opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { top: 80%; opacity: 0; }
  }
  @keyframes labelFade {
    0%   { opacity: 0; transform: translateY(6px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .ring-spin         { transform-origin: 160px 160px; animation: ringSpinAnim 3s linear infinite; }
  .ring-spin-reverse { transform-origin: 160px 160px; animation: ringSpinReverseAnim 5s linear infinite; }
  .syringe-float     { animation: floatAnim 3s ease-in-out infinite; }
  .scan-line         { animation: scanAnim 2.5s ease-in-out infinite; }
  .label-fade        { animation: labelFade 0.4s ease forwards; }
`;