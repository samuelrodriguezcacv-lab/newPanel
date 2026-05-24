// ─── MOLECULE: PawProgressBar ─────────────────────────────────────────────────
// Combina varios átomos PawIcon en una barra de progreso visual.
// Props:
//   total    → number — cuántas patitas mostrar en total
//   filled   → number — cuántas están activas/rellenas

import PawIcon from "../atoms/PawIcon";
import { GREEN, LIME } from "../MicrochipLoader/tokens";

export default function PawProgressBar({ total = 7, filled = 0 }) {
  return (
    <div style={styles.wrapper}>
      {/* Fila de patitas */}
      <div style={styles.pawRow}>
        {Array.from({ length: total }).map((_, i) => (
          <PawIcon
            key={i}
            filled={i < filled}
            delay={i * 80}
          />
        ))}
      </div>

      {/* Etiqueta inferior */}
      <p style={styles.sub}>Cargando microchip</p>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  pawRow: {
    display: "flex",
    gap: "6px",
    alignItems: "center",
  },
  sub: {
    color: LIME,
    fontSize: "12px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    margin: 0,
    // el lima es poco legible en blanco, el textShadow verde lo ancla
    textShadow: `0 0 8px ${GREEN}`,
  },
};
