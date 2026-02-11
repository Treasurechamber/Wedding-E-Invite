"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "./ContentProvider";

function useCountdown(weddingDate: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = new Date(weddingDate);
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function Block({ value, label }: { value: number; label: string }) {
  const s = String(value).padStart(2, "0");
  return (
    <motion.div
      layout
      className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-ink-800/80 px-4 py-6 backdrop-blur-sm md:px-6 md:py-8"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="font-sans text-3xl font-semibold tabular-nums text-gold-400 md:text-4xl">
        {s}
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.25em] text-slate-400">
        {label}
      </span>
    </motion.div>
  );
}

export function Countdown() {
  const content = useContent();
  const { days, hours, minutes, seconds } = useCountdown(content.weddingDate);

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-script text-4xl text-gold-400 md:text-5xl">
          Counting the Days
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-slate-400">
          Until We Say I Do
        </p>
        <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-6">
          <Block value={days} label="Days" />
          <Block value={hours} label="Hours" />
          <Block value={minutes} label="Minutes" />
          <Block value={seconds} label="Seconds" />
        </div>
      </div>
    </section>
  );
}
