"use client";

import { useCallback, useEffect, useState } from "react";
import { useContent } from "./ContentProvider";

const CLICKS_NEEDED = 3;
const CLICK_WINDOW_MS = 1500;

function hashtagFromNames(coupleNames: string, weddingDate?: string): string {
  let year = new Date().getFullYear();
  if (weddingDate && String(weddingDate).trim()) {
    const s = String(weddingDate).split(/[·\-–—|]/)[0].trim();
    const toTry = [
      s,
      /^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T16:00:00` : null,
      s.match(/(\d{4})/)?.[1] ?? null,
    ].filter(Boolean);
    for (const str of toTry) {
      const d = new Date(str as string);
      const y = d.getFullYear();
      if (!Number.isNaN(y) && y > 2000 && y < 2100) {
        year = y;
        break;
      }
    }
  }
  const base = coupleNames
    .replace(/\s*&\s*/gi, "And")
    .replace(/[^a-zA-Z0-9]/g, "");
  return base ? `#${base}${year}` : "";
}

export function Footer() {
  const content = useContent();
  const [clicks, setClicks] = useState(0);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleInitialsClick = useCallback(() => {
    if (timer) clearTimeout(timer);
    const next = clicks + 1;
    setClicks(next);
    if (next >= CLICKS_NEEDED) {
      setClicks(0);
      window.open("/admin", "_blank");
    } else {
      setTimer(setTimeout(() => setClicks(0), CLICK_WINDOW_MS));
    }
  }, [clicks, timer]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (e.key === "A") {
          e.preventDefault();
          window.open("/admin", "_blank");
        } else if (e.key === "M") {
          e.preventDefault();
          window.open("/master", "_blank");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <footer className="border-t border-[var(--color-border)] py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center">
        <button
          type="button"
          onClick={handleInitialsClick}
          className="font-script text-2xl text-[var(--color-primary)]/80 transition hover:text-[var(--color-primary)]"
          aria-label={content.coupleNames}
        >
          {content.coupleNames}
        </button>
        <p className="text-xs text-[var(--color-muted)]">
          {hashtagFromNames(content.coupleNames, content.weddingDate) || content.hashtag}
        </p>
      </div>
    </footer>
  );
}
