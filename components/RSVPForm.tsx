"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useContent } from "./ContentProvider";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormData = {
  fullName: string;
  email: string;
  phone: string;
  attending: "yes" | "no";
  guestCount: number;
  plusOneName: string;
  message: string;
};

export function RSVPForm() {
  const content = useContent();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          attending: data.attending === "yes",
          guest_count: data.guestCount,
          plus_one_name: data.plusOneName || null,
          message: data.message || null,
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // show error toast in real app
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-white/10 bg-ink-800/60 p-12 text-center backdrop-blur-sm"
      >
        <Heart className="mx-auto h-14 w-14 text-gold-400" />
        <h3 className="mt-4 font-script text-3xl text-gold-400">
          Thank You!
        </h3>
        <p className="mt-2 font-serif text-slate-300">
          Your response has been received. We can&apos;t wait to celebrate with you!
        </p>
      </motion.div>
    );
  }

  return (
    <section className="relative py-20 md:py-28">
      <div className="mx-auto max-w-2xl px-4">
        <h2 className="font-script text-4xl text-gold-400 md:text-5xl">
          Kindly Respond
        </h2>
        <p className="mt-3 font-serif text-sm tracking-[0.2em] text-slate-400">
          Please RSVP by {content.rsvpDeadline}
        </p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-12 space-y-6 rounded-3xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-sm md:p-10"
        >
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-300"
            >
              Full Name(s) *
            </label>
            <input
              id="fullName"
              {...register("fullName", { required: "Required" })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              placeholder="John & Jane Smith"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-amber-400">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Required" })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-amber-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-slate-300"
            >
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              {...register("phone")}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <span className="block text-sm font-medium text-slate-300">
              Will you be attending? *
            </span>
            <div className="mt-2 flex gap-6">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="yes"
                  {...register("attending", { required: "Required" })}
                  className="h-4 w-4 border-white/20 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-slate-300">Yes</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  value="no"
                  {...register("attending", { required: "Required" })}
                  className="h-4 w-4 border-white/20 text-gold-500 focus:ring-gold-500"
                />
                <span className="text-slate-300">No</span>
              </label>
            </div>
            {errors.attending && (
              <p className="mt-1 text-sm text-amber-400">{errors.attending.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="guestCount"
              className="block text-sm font-medium text-slate-300"
            >
              Number of Guests *
            </label>
            <select
              id="guestCount"
              {...register("guestCount", {
                required: "Required",
                valueAsNumber: true,
              })}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {errors.guestCount && (
              <p className="mt-1 text-sm text-amber-400">{errors.guestCount.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="plusOneName"
              className="block text-sm font-medium text-slate-300"
            >
              Plus One Name (if applicable)
            </label>
            <input
              id="plusOneName"
              {...register("plusOneName")}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              placeholder="Guest name"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-slate-300"
            >
              Message to the Couple
            </label>
            <textarea
              id="message"
              rows={4}
              {...register("message")}
              className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none focus:ring-1 focus:ring-gold-500/50"
              placeholder="Leave a note..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gold-500 py-4 font-serif text-sm uppercase tracking-[0.2em] text-ink-900 transition hover:bg-gold-400 disabled:opacity-70"
          >
            {isSubmitting ? "Sending..." : "Submit RSVP"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
