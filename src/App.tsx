import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "envelope" | "glow" | "invitation";

export const App: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("envelope");

  return (
    <div className="page-root">
      <AnimatePresence initial={false}>
        {phase !== "invitation" && (
          <motion.div
            key="envelope-overlay"
            className="envelope-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="envelope-screen">
              <motion.div
                className="envelope envelope--full"
                initial={{ scale: 1.02, y: 12, opacity: 0 }}
                animate={{
                  scale: 1,
                  y: 0,
                  opacity: phase === "glow" ? 0.9 : 1,
                }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                {/* Glow is now inside the envelope, above the body but below the card */}
                {phase === "glow" && (
                  <motion.div
                    className="glow-overlay"
                    aria-hidden="true"
                    initial={{ opacity: 0, scale: 0.96, y: 60 }}
                    animate={{
                      opacity: [0, 0.9, 0.8, 0],
                      scale: [0.96, 1, 1.02, 1.02],
                      y: [60, 30, 0, -30],
                    }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                  />
                )}

                <div className="envelope-body" />
                {/* Inner card that slides out of the envelope */}
                <motion.div
                  className="envelope-letter"
                  initial={{ y: 40, opacity: 0 }}
                  animate={
                    phase === "glow"
                      ? { y: -190, opacity: 1 }
                      : { y: 40, opacity: 0 }
                  }
                  transition={{ duration: 1.1, ease: "easeOut" }}
                  onAnimationComplete={() => {
                    if (phase === "glow") {
                      setPhase("invitation");
                    }
                  }}
                >
                  <p className="envelope-letter-heading">
                    You are cordially invited
                  </p>
                  <p className="envelope-letter-names">Alex &amp; Jordan</p>
                </motion.div>
                <motion.div
                  className="envelope-card"
                  animate={
                    phase === "glow"
                      ? { rotateX: -140 }
                      : { rotateX: 0 }
                  }
                  transition={{ duration: 1.1, ease: [0.25, 0.8, 0.25, 1] }}
                />
                <button
                  type="button"
                  className="wax-seal"
                  onClick={() => phase === "envelope" && setPhase("glow")}
                >
                  <span className="wax-initials">A&nbsp;&amp;&nbsp;J</span>
                </button>
                <p className="envelope-caption">Tap the seal to open</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "invitation" && (
        <div className="invitation-scroll">
          <section className="hero-section">
            <p className="ceremonial-text">
              You are cordially invited to the wedding of
            </p>
            <h1 className="names">Alex &amp; Jordan</h1>
            <p className="hero-subtitle">
              Saturday, September 12, 2026 · 4:00 PM
            </p>
            <p className="hero-location">Villa Aurelia · Florence, Italy</p>
          </section>

          <section className="photo-section">
            <div className="photo-placeholder">
              {/* Replace with real photography later */}
            </div>
            <p className="photo-caption">
              A small celebration with the people we love most.
            </p>
          </section>

          {/* More sections (countdown, venue, timeline, RSVP) will be added later */}
        </div>
      )}
    </div>
  );
};


