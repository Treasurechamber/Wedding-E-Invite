import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "./ContentProvider";

type EnvelopeGateProps = {
  onOpened: () => void;
};

export function EnvelopeGate({ onOpened }: EnvelopeGateProps) {
  const content = useContent();
  const [phase, setPhase] = useState<"idle" | "opening" | "done">("idle");

  useEffect(() => {
    if (phase === "done") {
      onOpened();
    }
  }, [phase, onOpened]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-ink-900 via-ink-900/95 to-black/95 px-3 md:px-8"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="relative w-[min(50rem,100vw)] aspect-[16/9] md:aspect-[5/3] perspective-[2000px]">
            {/* Envelope body */}
            <div className="absolute inset-[10%] rounded-[2.25rem] bg-gradient-to-br from-ink-800 to-ink-900 shadow-[0_30px_110px_rgba(0,0,0,0.96)] overflow-hidden">
              <div className="pointer-events-none absolute inset-px rounded-[2.15rem] border border-white/15" />
              <div className="pointer-events-none absolute inset-[10%] rounded-[1.7rem] border border-gold-500/35" />
              {/* Inner hidden glow that rises */}
              {phase === "opening" && (
                <motion.div
                  className="absolute inset-x-6 bottom-4 top-10 rounded-2xl"
                  initial={{ opacity: 0, y: 40, scaleY: 0.2 }}
                  animate={{
                    opacity: [0, 0.8, 0.6, 0],
                    y: [40, 10, -10, -30],
                    scaleY: [0.2, 0.7, 1, 1.1],
                  }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 50% 80%, rgba(252,211,77,1), transparent 55%), linear-gradient(80deg, rgba(254,252,232,0.5), transparent 45%), linear-gradient(100deg, rgba(254,252,232,0.3), transparent 45%)",
                    mixBlendMode: "screen",
                    filter: "blur(16px) brightness(1.4)",
                  }}
                />
              )}
            </div>

            {/* Top flap */}
            <motion.div
              className="absolute inset-x-[10%] top-[10%] bottom-[52%] origin-top bg-gradient-to-br from-ink-900 to-ink-800 border border-white/10 shadow-[0_26px_70px_rgba(0,0,0,0.98)]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
              }}
              animate={
                phase === "opening"
                  ? { rotateX: -155 }
                  : { rotateX: 0 }
              }
              transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
            />

            {/* Card that slides out */}
            <motion.div
              className="absolute inset-x-[18%] bottom-[14%] top-[34%] rounded-[1.9rem] glass-surface flex flex-col items-center justify-center text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={
                phase === "opening"
                  ? { y: -120, opacity: 1 }
                  : { y: 40, opacity: 0 }
              }
              transition={{ duration: 1.6, ease: "easeInOut" }}
              onAnimationComplete={() => {
                if (phase === "opening") {
                  setTimeout(() => setPhase("done"), 400);
                }
              }}
            >
              <p className="text-[0.7rem] tracking-[0.35em] uppercase text-slate-200/80 mb-4">
                You are invited to the wedding of
              </p>
              <p className="font-script text-4xl md:text-5xl text-gold-400 drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
                {content.coupleNames}
              </p>
              <p className="mt-3 text-[0.65rem] tracking-[0.32em] uppercase text-slate-300/70">
                Tap the seal to unfold
              </p>
            </motion.div>

            {/* Wax seal with initials */}
            <button
              type="button"
              onClick={() => phase === "idle" && setPhase("opening")}
              className="absolute left-1/2 top-1/2 z-20 grid h-[3.4rem] w-[6rem] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[1.7rem] bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400 shadow-[0_20px_50px_rgba(0,0,0,0.98)] border border-amber-100/90 ring-2 ring-gold-500/35 ring-offset-2 ring-offset-ink-900 transition-transform duration-200 ease-out hover:scale-105 active:scale-95"
            >
              <span
                className="font-script text-[2.1rem] leading-none text-[#111111]"
                style={{
                  textShadow:
                    "0 1px 0 rgba(255,255,255,0.85), 0 0 4px rgba(0,0,0,0.65)",
                }}
              >
                {content.coupleInitials}
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

