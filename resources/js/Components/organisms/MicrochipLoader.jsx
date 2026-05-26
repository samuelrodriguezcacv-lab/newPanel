// ─── ORGANISM: MicrochipLoader ────────────────────────────────────────────────
// Orquesta el estado del loader y compone las moléculas + átomos.
// Es el único lugar con useState / useEffect.
//
// Props:
//   onComplete → function — callback cuando el loader termina (opcional)
//
// Uso:
//   <MicrochipLoader onComplete={() => navigate("/home")} />

import { useState, useEffect } from "react";

import LoaderScene      from "../molecules/LoaderScene";
import PawProgressBar   from "../molecules/PawProgressBar";
import {
  GREEN,
  LOADER_STEPS,
  PAW_COUNT,
  LOADER_ANIMATIONS,
} from "../MicrochipLoader/tokens";

export default function MicrochipLoader({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [filledPaws,  setFilledPaws]  = useState(0);
  const [done,        setDone]        = useState(false);

  // ── Lógica de progreso ──────────────────────────────────────────────────────
  useEffect(() => {
    if (done) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 5;

        if (next >= LOADER_STEPS.length) {
          clearInterval(interval);
          setDone(true);
          setFilledPaws(PAW_COUNT);
          if (onComplete) setTimeout(onComplete, 1200);
          return prev;
        }

        setFilledPaws(
          Math.round((next / (LOADER_STEPS.length - 1)) * PAW_COUNT)
        );
        return next;
      });
    }, 900);

    return () => clearInterval(interval);
  }, [done, onComplete]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={styles.overlay}>
      {/* Inyectar keyframes una sola vez */}
      <style>{LOADER_ANIMATIONS}</style>

      {/* Molécula: escena circular (anillos + jeringa) */}
      <LoaderScene />

      {/* Texto del paso actual */}
      <p style={styles.label} key={currentStep} className="label-fade">
        {LOADER_STEPS[currentStep]}
      </p>

      {/* Molécula: barra de patitas + subtítulo */}
      <PawProgressBar total={PAW_COUNT} filled={filledPaws} />
    </div>
  );
}

// ── Estilos del organismo ─────────────────────────────────────────────────────
const styles = {
  overlay: {
    minHeight: "100vh",
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Courier New', monospace",
    gap: "24px",
    padding: "40px 20px",
  },
  label: {
    color: GREEN,
    fontSize: "18px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    margin: 0,
    textAlign: "center",
  },
};
