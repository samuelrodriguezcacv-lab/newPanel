// ─── ATOM: SyringeSVG ─────────────────────────────────────────────────────────
// Unidad mínima: el dibujo SVG de la jeringa microchip.
// No tiene estado ni lógica — solo renderiza la ilustración.

import { GREEN, LIME } from "../MicrochipLoader/tokens";

export default function SyringeSVG() {
  return (
    <div
      className="syringe-float"
      style={{ position: "relative", zIndex: 2, transform: "rotate(-45deg)" }}
    >
      <svg
        viewBox="0 0 160 300"
        width="120"
        height="220"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Aguja */}
        <line
          x1="80" y1="290" x2="80" y2="248"
          stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"
        />
        {/* Base de aguja */}
        <rect
          x="66" y="235" width="28" height="18" rx="4"
          fill="#e2e8f0" stroke={GREEN} strokeWidth="1.5"
        />
        {/* Bobina del microchip */}
        {[0, 4, 8, 12].map((i) => (
          <line
            key={i}
            x1="70" y1={240 + i} x2="90" y2={240 + i}
            stroke="#f97316" strokeWidth="1" opacity="0.9"
          />
        ))}
        {/* Cuerpo principal */}
        <rect
          x="55" y="115" width="50" height="125" rx="12"
          fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"
        />
        {/* Huella de patita decorativa en el cuerpo */}
        <g transform="translate(68, 155)" opacity="0.3">
          <ellipse cx="12" cy="14" rx="8"  ry="10" fill={GREEN} />
          <ellipse cx="4"  cy="6"  rx="4"  ry="5"  fill={GREEN} />
          <ellipse cx="12" cy="3"  rx="4"  ry="5"  fill={GREEN} />
          <ellipse cx="20" cy="6"  rx="4"  ry="5"  fill={GREEN} />
        </g>
        {/* Alas / apoyos de dedos */}
        <path
          d="M55,190 Q25,185 20,200 Q25,215 55,210"
          fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"
        />
        <path
          d="M105,190 Q135,185 140,200 Q135,215 105,210"
          fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1"
        />
        {/* Banda inferior lima */}
        <rect x="55" y="228" width="50" height="10" rx="5" fill={LIME} opacity="0.9" />
        {/* Varilla del émbolo */}
        <rect x="76" y="60" width="8" height="58" rx="4" fill="#cbd5e1" />
        {/* Anilla del émbolo */}
        <circle cx="80" cy="38" r="22" fill="none" stroke={GREEN} strokeWidth="8" />
        <circle cx="80" cy="38" r="12" fill="#f0fdf4" />
        {/* Tapón superior lima */}
        <rect x="60" y="110" width="40" height="12" rx="6" fill={LIME} opacity="0.9" />
        {/* Reflejo */}
        <rect x="60" y="115" width="8" height="60" rx="4" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}
