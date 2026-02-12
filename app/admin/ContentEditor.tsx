"use client";

import { useEffect, useState } from "react";
import type { WeddingContent } from "../../lib/content-types";
import { ImageUpload } from "./ImageUpload";

const DEFAULT_CONTENT: WeddingContent = {
  coupleNames: "Sophia & Alexander",
  coupleInitials: "S & A",
  weddingDate: "2025-09-14T16:00:00",
  weddingDateDisplay: "September 14, 2025",
  weddingTime: "4:00 PM",
  rsvpDeadline: "August 1, 2025",
  hashtag: "#SophiaAndAlexander2025",
  heroSlides: [
    "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3951915/pexels-photo-3951915.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  ceremony: {
    name: "Al Tawahin (Kalaa Weddings)",
    time: "4:00 PM",
    address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
    mapUrl: "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings)",
  },
  reception: {
    name: "Al Tawahin (Kalaa Weddings) – Grand Hall",
    time: "6:00 PM",
    address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
    mapUrl: "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings)",
  },
  events: [
    { time: "3:30 PM", title: "Guest Arrival" },
    { time: "4:00 PM", title: "Ceremony" },
    { time: "5:00 PM", title: "Cocktail Hour" },
    { time: "6:00 PM", title: "Reception & Dinner" },
    { time: "8:00 PM", title: "First Dance" },
    { time: "11:00 PM", title: "Last Dance" },
  ],
  venueCards: [
    { title: "Garden Terrace", subtitle: "Sunset Ceremony", src: "/venue/k1.jpg" },
    { title: "Grand Hall", subtitle: "Reception & Dinner", src: "/venue/k2.jpg" },
  ],
  mapEmbedUrl: "https://www.google.com/maps?q=Al+Tawahin+(Kalaa+Weddings)&output=embed",
};

type ContentEditorProps = {
  supabase: import("@supabase/supabase-js").SupabaseClient;
};

export function ContentEditor({ supabase }: ContentEditorProps) {
  const [content, setContent] = useState<WeddingContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await supabase
          .from("wedding_content")
          .select("data")
          .eq("id", "default")
          .maybeSingle();
        const row = res.data as { data: WeddingContent } | null;
        if (row?.data) {
          setContent({ ...DEFAULT_CONTENT, ...row.data });
        } else {
          setContent(DEFAULT_CONTENT);
        }
      } catch {
        setContent(DEFAULT_CONTENT);
      }
    })();
  }, [supabase]);

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
    const { error } = await (supabase as any)
      .from("wedding_content")
      .upsert(
        { id: "default", data: content, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );
    setSaving(false);
    setMessage(error ? "Failed to save" : "Saved!");
    if (!error) setTimeout(() => setMessage(""), 2000);
  };

  if (!content) {
    return (
      <div className="rounded-xl border border-white/10 bg-ink-800/60 p-8 text-center text-slate-400">
        Loading content…
      </div>
    );
  }

  const update = <K extends keyof WeddingContent>(
    key: K,
    value: WeddingContent[K]
  ) => setContent((c) => (c ? { ...c, [key]: value } : c));

  const updateNested = (
    parent: "ceremony" | "reception",
    key: string,
    value: string
  ) =>
    setContent((c) =>
      c ? { ...c, [parent]: { ...c[parent], [key]: value } } : c
    );

  const uploadImage = async (file: File, folder: string) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("wedding-images")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from("wedding-images")
      .getPublicUrl(path);
    return publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-script text-2xl text-gold-400">Master Content</h2>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-gold-500 px-4 py-2 text-ink-900 transition hover:bg-gold-400 disabled:opacity-70"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
      {message && (
        <p className={message === "Saved!" ? "text-emerald-400" : "text-amber-400"}>
          {message}
        </p>
      )}

      <div className="rounded-xl border-2 border-gold-500/30 bg-ink-800/60 p-6">
        <h3 className="font-serif text-lg text-gold-400">📷 Hero Carousel Images</h3>
        <p className="mt-1 text-sm text-slate-400">Click <strong className="text-gold-400">Browse / Upload</strong> to add photos from your computer, or paste image URLs.</p>
        <div className="mt-3 space-y-3">
          {content.heroSlides.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <ImageUpload
                value={url}
                onChange={(v) => {
                  const next = [...content.heroSlides];
                  next[i] = v;
                  update("heroSlides", next);
                }}
                onUpload={(f) => uploadImage(f, "hero")}
                placeholder="Slide"
              />
              <button
                type="button"
                onClick={() => update("heroSlides", content.heroSlides.filter((_, j) => j !== i))}
                className="shrink-0 rounded px-2 py-1 text-xs text-amber-400 hover:bg-ink-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("heroSlides", [...content.heroSlides, ""])}
            className="rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-slate-400 hover:border-gold-500/50 hover:text-gold-400"
          >
            + Add slide
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-white/10 bg-ink-800/60 p-6">
          <h3 className="font-serif text-sm text-gold-400">Couple & Dates</h3>
          <Field label="Couple Names" value={content.coupleNames} onChange={(v) => update("coupleNames", v)} />
          <Field label="Initials (envelope seal)" value={content.coupleInitials} onChange={(v) => update("coupleInitials", v)} />
          <Field label="Wedding Date (YYYY-MM-DD)" value={content.weddingDate.split("T")[0]} onChange={(v) => update("weddingDate", v + "T16:00:00")} />
          <Field label="Wedding Date Display" value={content.weddingDateDisplay} onChange={(v) => update("weddingDateDisplay", v)} />
          <Field label="Wedding Time" value={content.weddingTime} onChange={(v) => update("weddingTime", v)} />
          <Field label="RSVP Deadline" value={content.rsvpDeadline} onChange={(v) => update("rsvpDeadline", v)} />
          <Field label="Hashtag" value={content.hashtag} onChange={(v) => update("hashtag", v)} />
        </div>

        <div className="space-y-4 rounded-xl border border-white/10 bg-ink-800/60 p-6">
          <h3 className="font-serif text-sm text-gold-400">Ceremony</h3>
          <Field label="Name" value={content.ceremony.name} onChange={(v) => updateNested("ceremony", "name", v)} />
          <Field label="Time" value={content.ceremony.time} onChange={(v) => updateNested("ceremony", "time", v)} />
          <Field label="Address" value={content.ceremony.address} onChange={(v) => updateNested("ceremony", "address", v)} />
          <Field label="Map URL" value={content.ceremony.mapUrl} onChange={(v) => updateNested("ceremony", "mapUrl", v)} />

          <h3 className="mt-6 font-serif text-sm text-gold-400">Reception</h3>
          <Field label="Name" value={content.reception.name} onChange={(v) => updateNested("reception", "name", v)} />
          <Field label="Time" value={content.reception.time} onChange={(v) => updateNested("reception", "time", v)} />
          <Field label="Address" value={content.reception.address} onChange={(v) => updateNested("reception", "address", v)} />
          <Field label="Map URL" value={content.reception.mapUrl} onChange={(v) => updateNested("reception", "mapUrl", v)} />
          <Field label="Map Embed URL (iframe src)" value={content.mapEmbedUrl} onChange={(v) => update("mapEmbedUrl", v)} />
        </div>
      </div>

      <div className="rounded-xl border-2 border-gold-500/30 bg-ink-800/60 p-6">
        <h3 className="font-serif text-lg text-gold-400">📷 Hero Carousel Images</h3>
        <p className="mt-1 text-sm text-slate-400">Click <strong className="text-gold-400">Browse / Upload</strong> to add photos from your computer, or paste image URLs.</p>
        <div className="mt-3 space-y-3">
          {content.heroSlides.map((url, i) => (
            <div key={i} className="flex items-center gap-2">
              <ImageUpload
                value={url}
                onChange={(v) => {
                  const next = [...content.heroSlides];
                  next[i] = v;
                  update("heroSlides", next);
                }}
                onUpload={(f) => uploadImage(f, "hero")}
                placeholder="Slide"
              />
              <button
                type="button"
                onClick={() => update("heroSlides", content.heroSlides.filter((_, j) => j !== i))}
                className="shrink-0 rounded px-2 py-1 text-xs text-amber-400 hover:bg-ink-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("heroSlides", [...content.heroSlides, ""])}
            className="rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-slate-400 hover:border-gold-500/50 hover:text-gold-400"
          >
            + Add slide
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-ink-800/60 p-6">
        <h3 className="font-serif text-sm text-gold-400">Venue Cards (Day of Events images)</h3>
        <p className="mt-1 text-xs text-slate-400">Browse to upload or paste URLs.</p>
        <div className="mt-4 space-y-4">
          {content.venueCards.map((card, i) => (
            <div key={i} className="rounded-lg border border-white/5 bg-ink-900/50 p-4">
              <Field label="Title" value={card.title} onChange={(v) => {
                const next = [...content.venueCards];
                next[i] = { ...next[i], title: v };
                update("venueCards", next);
              }} />
              <Field label="Subtitle" value={card.subtitle} onChange={(v) => {
                const next = [...content.venueCards];
                next[i] = { ...next[i], subtitle: v };
                update("venueCards", next);
              }} />
              <div className="mt-2">
                <label className="block text-xs text-slate-400">Image</label>
                <div className="mt-1">
                  <ImageUpload
                    value={card.src}
                    onChange={(v) => {
                      const next = [...content.venueCards];
                      next[i] = { ...next[i], src: v };
                      update("venueCards", next);
                    }}
                    onUpload={(f) => uploadImage(f, "venue")}
                    placeholder="Venue"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() => update("venueCards", [...content.venueCards, { title: "", subtitle: "", src: "" }])}
            className="rounded-lg border border-dashed border-white/20 px-4 py-2 text-sm text-slate-400 hover:border-gold-500/50 hover:text-gold-400"
          >
            + Add venue card
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-ink-800/60 p-6">
        <h3 className="font-serif text-sm text-gold-400">Day of Events</h3>
        <p className="mt-1 text-xs text-slate-400">Format: time | title (one per line, e.g. 4:00 PM | Ceremony)</p>
        <textarea
          value={content.events.map((e) => `${e.time} | ${e.title}`).join("\n")}
          onChange={(e) => {
            const events = e.target.value
              .split("\n")
              .filter(Boolean)
              .map((line) => {
                const [time, ...rest] = line.split("|").map((s) => s.trim());
                return { time: time ?? "", title: rest.join("|").trim() || "" };
              });
            update("events", events);
          }}
          rows={6}
          className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 focus:border-gold-500/50 focus:outline-none"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-champagne-50 focus:border-gold-500/50 focus:outline-none"
      />
    </div>
  );
}
