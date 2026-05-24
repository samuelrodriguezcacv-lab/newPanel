// ─── ATOM: PawIcon ────────────────────────────────────────────────────────────
// Unidad mínima: un solo SVG de huella de patita.
// Props:
//   filled  → boolean  — si está activa (verde) o inactiva (gris)
//   delay   → number   — ms de retraso para la transición (stagger efect)

import { GREEN, LIME } from "../MicrochipLoader/tokens";

export default function PawIcon({ filled = false, delay = 0 }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="30"
      height="30"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transition: `all 0.4s ease ${delay}ms`,
        filter: filled ? `drop-shadow(0 0 5px ${LIME})` : "none",
        opacity: filled ? 1 : 0.2,
      }}
    >
      {/* Almohadilla principal */}
      <ellipse cx="20" cy="25" rx="11" ry="12" fill={filled ? GREEN : "#94a3b8"} />
      {/* Tres dedos */}
      <ellipse cx="8"  cy="13" rx="5" ry="6"   fill={filled ? GREEN : "#94a3b8"} />
      <ellipse cx="20" cy="8"  rx="5" ry="6"   fill={filled ? GREEN : "#94a3b8"} />
      <ellipse cx="32" cy="13" rx="5" ry="6"   fill={filled ? GREEN : "#94a3b8"} />
      {/* Destello lima cuando está activa */}
      {filled && (
        <ellipse cx="16" cy="21" rx="3" ry="3.5" fill={LIME} opacity="0.7" />
      )}
    </svg>
  );
}
