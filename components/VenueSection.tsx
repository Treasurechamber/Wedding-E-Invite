"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "./ContentProvider";

export function VenueSection() {
  const content = useContent();
  const { ceremony, reception, mapEmbedUrl } = content;
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
              {ceremony.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-slate-300">
              {ceremony.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{ceremony.address}</span>
            </div>
            <a
              href={ceremony.mapUrl}
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
              {reception.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-slate-300">
              {reception.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-slate-400">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{reception.address}</span>
            </div>
            <a
              href={reception.mapUrl}
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
            title="Wedding venue map"
            src={mapEmbedUrl || "https://www.google.com/maps?output=embed"}
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
