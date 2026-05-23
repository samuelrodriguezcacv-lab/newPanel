// ─── MOLECULE: LoaderScene ────────────────────────────────────────────────────
// Combina los átomos LoaderRings + SyringeSVG dentro del contenedor circular.
// Es la "escena" visual central del loader.

import LoaderRings from "../atoms/LoaderRings";
import SyringeSVG  from "../atoms/SyringeSVG";

export default function LoaderScene() {
  return (
    <div style={styles.scene}>
      <LoaderRings />
      <SyringeSVG />
    </div>
  );
}

const styles = {
  scene: {
    position: "relative",
    width: "320px",
    height: "320px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};
