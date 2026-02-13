"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { WeddingContent } from "../lib/content-types";
import { supabase } from "../lib/supabase";

const defaultContent: WeddingContent = {
  coupleNames: "Sophia & Alexander",
  coupleInitials: "S & A",
  weddingDate: "2026-06-05T16:00:00",
  weddingDateDisplay: "June 5, 2026",
  weddingTime: "4:00 PM",
  rsvpDeadline: "August 1, 2025",
  hashtag: "#SophiaAndAlexander2025",
  heroSlides: [],
  ceremony: { name: "", time: "", address: "", mapUrl: "" },
  reception: { name: "", time: "", address: "", mapUrl: "" },
  events: [],
  venueCards: [],
  mapEmbedUrl: "",
};

const ContentContext = createContext<WeddingContent>(defaultContent);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WeddingContent>(defaultContent);
  const pathname = usePathname();

  const fetchContent = async () => {
    if (!supabase) {
      // Fallback to API if Supabase client unavailable (e.g. missing env vars)
      fetch(`/api/content?t=${Date.now()}`)
        .then((r) => r.json())
        .then((data) => setContent({ ...defaultContent, ...data }))
        .catch(() => {});
      return;
    }
    const { data, error } = await supabase
      .from("wedding_content")
      .select("data")
      .eq("id", "default")
      .maybeSingle();
    if (!error && data?.data) {
      setContent({ ...defaultContent, ...(data.data as object) });
    } else {
      // Fallback to API if Supabase read fails
      fetch(`/api/content?t=${Date.now()}`)
        .then((r) => r.json())
        .then((apiData) => setContent({ ...defaultContent, ...apiData }))
        .catch(() => {});
    }
  };

  useEffect(() => {
    fetchContent();
    const interval = setInterval(fetchContent, 3000);
    const onFocus = () => fetchContent();
    window.addEventListener("visibilitychange", onFocus);
    const channel = supabase
      ? supabase
          .channel("wedding_content_live")
          .on("postgres_changes", { event: "*", schema: "public", table: "wedding_content" }, () => {
            fetchContent();
          })
          .subscribe()
      : null;
    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onFocus);
      if (channel) supabase?.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/") fetchContent();
  }, [pathname]);

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
