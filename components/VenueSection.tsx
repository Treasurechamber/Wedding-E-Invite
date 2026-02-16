"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { useContent } from "./ContentProvider";

const LEBANON_MAP_URL = "https://www.google.com/maps?q=Al+Tawahin+Kalaa+Weddings+Ein+Baal+Lebanon&output=embed";

export function VenueSection() {
  const content = useContent();
  const { ceremony, reception, mapEmbedUrl } = content;
  // Force Lebanon map for Al Tawahin/Kalaa (avoids Syria result)
  const mapUrl = (mapEmbedUrl && !mapEmbedUrl.toLowerCase().includes("lebanon") && /tawahin|kalaa/i.test(mapEmbedUrl))
    ? LEBANON_MAP_URL
    : (mapEmbedUrl || LEBANON_MAP_URL);
  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="font-script text-4xl text-[var(--color-primary)] md:text-5xl">
          Join Us
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-[var(--color-muted)]">
          Ceremony &amp; Reception
        </p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-12">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-6 backdrop-blur-sm md:p-8"
          >
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Ceremony
            </p>
            <h3 className="mt-2 font-serif text-xl text-[var(--color-text)]">
              {ceremony.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-[var(--color-muted)]">
              {ceremony.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-[var(--color-muted)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{ceremony.address}</span>
            </div>
            <a
              href={ceremony.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] transition opacity-90 hover:opacity-100"
            >
              Get Directions <ExternalLink className="h-4 w-4" />
            </a>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-light)] p-6 backdrop-blur-sm md:p-8"
          >
            <p className="font-serif text-xs uppercase tracking-[0.3em] text-[var(--color-primary)]">
              Reception
            </p>
            <h3 className="mt-2 font-serif text-xl text-[var(--color-text)]">
              {reception.name}
            </h3>
            <p className="mt-2 font-sans text-sm text-[var(--color-muted)]">
              {reception.time}
            </p>
            <div className="mt-4 flex items-start gap-2 text-[var(--color-muted)]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span className="text-sm">{reception.address}</span>
            </div>
            <a
              href={reception.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-primary)] transition opacity-90 hover:opacity-100"
            >
              Get Directions <ExternalLink className="h-4 w-4" />
            </a>
          </motion.article>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 overflow-hidden rounded-2xl border border-[var(--color-border)]"
        >
          <iframe
            title="Wedding venue map"
            src={mapUrl}
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
