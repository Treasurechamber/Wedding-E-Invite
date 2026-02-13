"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const FALLBACK_DATE = "2026-06-05T16:00:00";

function useCountdown(weddingDate: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Parse date - handle ISO, YYYY-MM-DD, "April 5, 2026", "JUNE 5, 2026 · 4:00 PM", MM/DD/YYYY, etc.
  const target = (() => {
    const raw = typeof weddingDate === "string" ? weddingDate : String(weddingDate || "");
    const s = raw.split(/[·\-–—|]/)[0].trim() || "";
    if (!s) return new Date(FALLBACK_DATE);

    const tryParse = (str: string): Date | null => {
      const d = new Date(str);
      return !Number.isNaN(d.getTime()) ? d : null;
    };

    // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const toParse = s.includes("T") ? s : `${s}T16:00:00`;
      const d = tryParse(toParse);
      if (d) return d;
    }

    // "April 5, 2026" or "JUNE 5, 2026" - normalize month
    const textMatch = s.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/);
    if (textMatch) {
      const [, month, day, year] = textMatch;
      const normalized = `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${day}, ${year}`;
      const d = tryParse(normalized);
      if (d) return d;
    }

    // MM/DD/YYYY or DD/MM/YYYY
    const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, a, b, year] = slashMatch;
      const d1 = tryParse(`${year}-${a.padStart(2, "0")}-${b.padStart(2, "0")}T16:00:00`);
      if (d1) return d1;
      const d2 = tryParse(`${year}-${b.padStart(2, "0")}-${a.padStart(2, "0")}T16:00:00`);
      if (d2) return d2;
    }

    return tryParse(s) ?? new Date(FALLBACK_DATE);
  })();

  const diff = Math.max(0, target.getTime() - now.getTime());
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
  const [dateStr, setDateStr] = useState(FALLBACK_DATE);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        const d = data?.weddingDate || data?.weddingDateDisplay || FALLBACK_DATE;
        setDateStr(String(d).trim() || FALLBACK_DATE);
      })
      .catch(() => {});
  }, []);

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
