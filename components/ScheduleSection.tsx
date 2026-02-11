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

const EVENTS = [
  { icon: Users, time: "3:30 PM", title: "Guest Arrival" },
  { icon: Heart, time: "4:00 PM", title: "Ceremony" },
  { icon: Wine, time: "5:00 PM", title: "Cocktail Hour" },
  { icon: UtensilsCrossed, time: "6:00 PM", title: "Reception & Dinner" },
  { icon: Music, time: "8:00 PM", title: "First Dance" },
  { icon: Moon, time: "11:00 PM", title: "Last Dance" },
];

const VENUE_CARDS = [
  {
    title: "Garden Terrace",
    subtitle: "Sunset Ceremony",
    src: "/venue/k1.jpg",
  },
  {
    title: "Grand Hall",
    subtitle: "Reception & Dinner",
    src: "/venue/k2.jpg",
  },
];

export function ScheduleSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="font-script text-4xl text-gold-400 md:text-5xl">
          Day of Events
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-slate-400">
          Saturday, September 14, 2025
        </p>

        <div className="mt-14 max-w-2xl">
          {EVENTS.map(({ icon: Icon, time, title }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative flex items-start gap-6 py-5"
            >
              {i < EVENTS.length - 1 && (
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
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 grid gap-6 md:grid-cols-2"
        >
          {VENUE_CARDS.map((card) => (
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
