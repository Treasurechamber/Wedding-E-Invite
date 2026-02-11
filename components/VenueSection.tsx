"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const CEREMONY = {
  name: "Al Tawahin (Kalaa Weddings)",
  time: "4:00 PM",
  address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
  mapUrl:
    "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings),+%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9%D8%8C+%D8%B9%D9%8A%D9%86+%D8%A8%D8%B9%D8%A7%D9%84%E2%80%AD/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x151e872e4159d141:0x9a73b3f4bea14c6c?sa=X&ved=1t:57443&ictx=111",
};

const RECEPTION = {
  name: "Al Tawahin (Kalaa Weddings) – Grand Hall",
  time: "6:00 PM",
  address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
  mapUrl: CEREMONY.mapUrl,
};

export function VenueSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-script text-4xl text-gold-400 md:text-5xl">
          Join Us
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-slate-400">
          Ceremony &amp; Reception
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-sm md:p-8"
          >
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold-400">
              Ceremony
            </p>
            <h3 className="mt-2 font-serif text-xl text-champagne-50">
              {CEREMONY.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-slate-300">
              {CEREMONY.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{CEREMONY.address}</span>
            </div>
            <a
              href={CEREMONY.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-gold-400 transition hover:text-gold-300"
            >
              Get Directions <ExternalLink className="h-4 w-4" />
            </a>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-sm md:p-8"
          >
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-gold-400">
              Reception
            </p>
            <h3 className="mt-2 font-serif text-xl text-champagne-50">
              {RECEPTION.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-slate-300">
              {RECEPTION.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{RECEPTION.address}</span>
            </div>
            <a
              href={RECEPTION.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-gold-400 transition hover:text-gold-300"
            >
              Get Directions <ExternalLink className="h-4 w-4" />
            </a>
          </motion.article>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-white/10"
        >
          <iframe
            title="Al Tawahin (Kalaa Weddings) map"
            src="https://www.google.com/maps?q=Al+Tawahin+(Kalaa+Weddings),+%D8%A7%D9%84%D9%82%D9%84%D8%B9%D8%A9%D8%8C+%D8%B9%D9%8A%D9%86+%D8%A8%D8%B9%D8%A7%D9%84&output=embed"
            width="100%"
            height="320"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[0.3]"
          />
        </motion.div>
      </div>
    </section>
  );
}
