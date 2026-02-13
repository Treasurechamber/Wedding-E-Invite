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

  // Parse date - handle ISO, YYYY-MM-DD, "April 5, 2026", "JUNE 5, 2026 · 4:00 PM", etc.
  const target = (() => {
    if (!weddingDate || typeof weddingDate !== "string") return null;
    // Strip " · 4:00 PM" or similar suffix - use only the date part
    let s = weddingDate.split(/[·\-–—|]/)[0].trim();
    if (!s) return null;
    // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T|$)/);
    if (isoMatch) {
      const toParse = s.includes("T") ? s : `${s}T16:00:00`;
      const d = new Date(toParse);
      if (!Number.isNaN(d.getTime())) return d;
    }
    // "April 5, 2026" or "JUNE 5, 2026" - normalize month for browser compatibility
    const textMatch = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/);
    if (textMatch) {
      const [, month, day, year] = textMatch;
      const normalized = `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${day}, ${year}`;
      const d = new Date(normalized);
      if (!Number.isNaN(d.getTime())) return d;
    }
    // Last resort: try raw parse
    const d = new Date(s);
    return !Number.isNaN(d.getTime()) ? d : null;
  })();

  const diff = target
    ? Math.max(0, target.getTime() - now.getTime())
    : 0;
  const days = Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const seconds = Math.max(0, Math.floor((diff % (1000 * 60)) / 1000));

  return { days, hours, minutes, seconds };
}

function Block({ value, label }: { value: number; label: string }) {
  const n = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const s = String(n).padStart(2, "0");
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
  // Use weddingDate (ISO) first; fallback to weddingDateDisplay if weddingDate invalid
  const dateStr = content.weddingDate || content.weddingDateDisplay || "";
  const { days, hours, minutes, seconds } = useCountdown(dateStr);

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
