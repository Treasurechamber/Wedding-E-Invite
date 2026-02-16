"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useContent } from "./ContentProvider";

// June 5, 2026 4:00 PM - use explicit construction so it always works
const FALLBACK_TARGET = new Date(2026, 5, 5, 16, 0, 0);

function useCountdown(weddingDate: string) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const target = (() => {
    const raw = typeof weddingDate === "string" ? weddingDate : String(weddingDate || "");
    const s = raw.split(/[·\-–—|]/)[0].trim().replace(/\s+/g, " ") || "";
    if (!s) return FALLBACK_TARGET;

    const tryParse = (str: string): Date | null => {
      const d = new Date(str);
      return !Number.isNaN(d.getTime()) ? d : null;
    };

    // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
    const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const toParse = s.includes("T") ? s : `${s}T16:00:00`;
      const d = tryParse(toParse);
      if (d && d > new Date()) return d;
    }

    // "April 5, 2026" or "JUNE 5, 2026" - normalize month
    const textMatch = s.match(/([A-Za-z]+)\s+(\d{1,2}),?\s*(\d{4})/);
    if (textMatch) {
      const [, month, day, year] = textMatch;
      const normalized = `${month.charAt(0).toUpperCase()}${month.slice(1).toLowerCase()} ${day}, ${year}`;
      const d = tryParse(normalized);
      if (d && d > new Date()) return d;
    }

    // MM/DD/YYYY or DD/MM/YYYY
    const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, a, b, year] = slashMatch;
      const d1 = tryParse(`${year}-${a.padStart(2, "0")}-${b.padStart(2, "0")}T16:00:00`);
      if (d1 && d1 > new Date()) return d1;
      const d2 = tryParse(`${year}-${b.padStart(2, "0")}-${a.padStart(2, "0")}T16:00:00`);
      if (d2 && d2 > new Date()) return d2;
    }

    const parsed = tryParse(s);
    return parsed && parsed > new Date() ? parsed : FALLBACK_TARGET;
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
      className="flex flex-col items-center gap-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] px-4 py-6 backdrop-blur-sm md:px-6 md:py-8"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="font-sans text-3xl font-semibold tabular-nums text-[var(--color-primary)] md:text-4xl">
        {s}
      </span>
      <span className="text-[0.7rem] uppercase tracking-[0.25em] text-[var(--color-muted)]">
        {label}
      </span>
    </motion.div>
  );
}

export function Countdown() {
  const content = useContent();
  const dateStr = content?.weddingDate || content?.weddingDateDisplay || "2026-06-05T16:00:00";

  const { days, hours, minutes, seconds } = useCountdown(
    typeof dateStr === "string" ? dateStr : "2026-06-05T16:00:00"
  );

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="font-script text-4xl text-[var(--color-primary)] md:text-5xl">
          Counting the Days
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-[var(--color-muted)]">
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
