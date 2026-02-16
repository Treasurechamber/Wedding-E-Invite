"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useContent } from "../ContentProvider";

const FALLBACK_SLIDES = [
  "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3951915/pexels-photo-3951915.jpeg?auto=compress&cs=tinysrgb&w=1600",
];

export function HeroRose() {
  const content = useContent();
  const slides = content.heroSlides.length > 0 ? content.heroSlides : FALLBACK_SLIDES;
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="relative grid min-h-[90vh] w-full grid-cols-1 overflow-hidden md:grid-cols-2">
      <div className="relative order-2 h-[50vh] md:order-1 md:h-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index]}
              alt="Wedding"
              fill
              className="object-cover"
              sizes="50vw"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-transparent to-transparent md:from-[var(--color-bg)]/80" />
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-black/60"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-black/60"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="relative order-1 flex flex-col items-center justify-center px-8 py-16 md:order-2 md:px-12">
        <p className="font-serif text-xs tracking-[0.4em] uppercase text-[var(--color-muted)]">The wedding of</p>
        <h1 className="mt-4 font-script text-4xl text-[var(--color-primary)] md:text-5xl lg:text-6xl">
          {content.coupleNames}
        </h1>
        <p className="mt-6 font-serif text-sm tracking-[0.2em] text-[var(--color-muted)]">
          {content.weddingDateDisplay} · {content.weddingTime}
        </p>
        <p className="mt-4 font-serif text-xs italic text-[var(--color-muted)]">
          &ldquo;Love is composed of a single soul inhabiting two bodies.&rdquo;
        </p>
      </div>
    </section>
  );
}
