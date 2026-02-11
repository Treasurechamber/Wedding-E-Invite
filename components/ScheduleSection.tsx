"use client";

import {
  Users,
  Heart,
  Wine,
  UtensilsCrossed,
  Music,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useContent } from "./ContentProvider";

const ICONS = [Users, Heart, Wine, UtensilsCrossed, Music, Moon];

export function ScheduleSection() {
  const content = useContent();
  const events = content.events;
  const venueCards = content.venueCards;
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-script text-4xl text-gold-400 md:text-5xl">
          Day of Events
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-slate-400">
          {content.weddingDateDisplay}
        </p>

        <div className="mt-14 max-w-2xl">
          {events.map(({ time, title }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex items-start gap-6 py-5"
            >
              {i < events.length - 1 && (
                <div className="absolute left-5 top-14 bottom-0 w-px bg-gradient-to-b from-gold-500/50 to-transparent" />
              )}
              <div className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-500/40 bg-ink-800/80">
                <Icon className="h-5 w-5 text-gold-400" />
              </div>
              <div>
                <p className="font-serif text-sm text-gold-400">{time}</p>
                <h3 className="mt-1 font-serif text-lg text-champagne-50">
                  {title}
                </h3>
              </div>
            </motion.div>
          );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {venueCards.map((card) => (
            <div
              key={card.title}
              className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/60"
            >
              <div className="relative h-44 w-full">
                <Image
                  src={card.src}
                  alt={card.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-transparent" />
              </div>
              <div className="px-5 pb-5 pt-4 text-left">
                <p className="text-xs font-serif uppercase tracking-[0.28em] text-gold-400">
                  {card.subtitle}
                </p>
                <p className="mt-1 font-serif text-lg text-champagne-50">
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
