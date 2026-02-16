"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "../ContentProvider";

const FALLBACK =
  "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600";

export function HeroMinimal() {
  const content = useContent();
  const heroImage = content.heroSlides[0] || FALLBACK;

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt=""
          fill
          className="object-cover opacity-40"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-[var(--color-bg)]/70" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 max-w-2xl px-6 text-center"
      >
        <p className="font-serif text-xs tracking-[0.5em] uppercase text-[var(--color-muted)]">
          You are invited
        </p>
        <h1 className="mt-6 font-serif text-4xl font-semibold tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl">
          {content.coupleNames}
        </h1>
        <p className="mt-6 font-serif text-sm text-[var(--color-muted)]">
          {content.weddingDateDisplay}
        </p>
        <p className="mt-2 font-serif text-sm text-[var(--color-muted)]">
          {content.weddingTime}
        </p>
      </motion.div>
    </section>
  );
}
