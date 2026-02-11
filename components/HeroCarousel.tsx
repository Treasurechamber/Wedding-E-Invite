"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3951915/pexels-photo-3951915.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative h-[85vh] min-h-[420px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index]}
            alt="Wedding photo"
            fill
            className="object-cover"
            sizes="100vw"
            priority={index === 0}
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/20 to-transparent"
            aria-hidden
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20">
        <p className="font-serif text-xs tracking-[0.35em] uppercase text-slate-200/90">
          The wedding of
        </p>
        <h1 className="mt-2 font-script text-4xl text-gold-400 drop-shadow-[0_12px_32px_rgba(0,0,0,0.9)] md:text-[3.6rem]">
          Sophia &amp; Alexander
        </h1>
        <p className="mt-4 font-serif text-sm tracking-[0.2em] uppercase text-slate-300/95">
          September 14, 2025 · 4:00 PM
        </p>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-900/60 text-white transition hover:bg-ink-900/90"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-ink-900/60 text-white transition hover:bg-ink-900/90"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-gold-400" : "w-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
