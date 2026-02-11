"use client";

import { useCallback, useEffect, useState } from "react";
import { useContent } from "./ContentProvider";

const CLICKS_NEEDED = 3;
const CLICK_WINDOW_MS = 1500;

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
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "A") {
        e.preventDefault();
        window.open("/admin", "_blank");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <footer className="border-t border-white/5 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center">
        <button
          type="button"
          onClick={handleInitialsClick}
          className="font-script text-2xl text-gold-400/80 transition hover:text-gold-400"
          aria-label={content.coupleNames}
        >
          {content.coupleNames}
        </button>
        <p className="text-xs text-slate-500">
          {content.hashtag}
        </p>
      </div>
    </footer>
  );
}
