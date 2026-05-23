// ─── ATOM: LoaderRings ────────────────────────────────────────────────────────
// Unidad mínima: los dos anillos SVG giratorios + la línea de escaneo.
// No tiene estado — solo animaciones CSS.

import { GREEN, LIME } from "../MicrochipLoader/tokens";

export default function LoaderRings() {
  return (
    <>
      {/* SVG con los dos anillos */}
      <svg
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
        }}
        viewBox="0 0 320 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pista base */}
        <circle
          cx="160" cy="160" r="140"
          fill="none" stroke="rgb(187,247,208)" strokeWidth="2"
        />
        {/* Arco giratorio — VERDE */}
        <circle
          cx="160" cy="160" r="140"
          fill="none"
          stroke={GREEN}
          strokeWidth="3"
          strokeDasharray="220 660"
          strokeLinecap="round"
          className="ring-spin"
        />
        {/* Anillo interior punteado — LIMA */}
        <circle
          cx="160" cy="160" r="115"
          fill="none"
          stroke={LIME}
          strokeWidth="2"
          strokeDasharray="6 14"
          strokeLinecap="round"
          className="ring-spin-reverse"
          opacity="0.7"
        />
      </svg>

      {/* Línea de escaneo */}
      <div
        className="scan-line"
        style={{
          position: "absolute",
          left: "20px", right: "20px",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${LIME}88, ${GREEN}, ${LIME}88, transparent)`,
          borderRadius: "2px",
          zIndex: 3,
          top: "50%",
        }}
      />
    </>
  );
}
