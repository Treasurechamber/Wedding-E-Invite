"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { WeddingContent } from "../lib/content-types";
import { supabase } from "../lib/supabase";

const defaultContent: WeddingContent = {
  theme: "gold",
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

const RESERVED = ["admin", "master", "manage", "api"];

function getWeddingSlug(pathname: string | null): string {
  if (!pathname || pathname === "/") return "default";
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0 || RESERVED.includes(segments[0])) return "default";
  return segments[0];
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<WeddingContent>(defaultContent);
  const pathname = usePathname();
  const slug = useMemo(() => getWeddingSlug(pathname), [pathname]);

  const fetchContent = useMemo(() => {
    return async () => {
      if (!slug) return;
      if (!supabase) {
        fetch(`/api/content?wedding=${slug}&t=${Date.now()}`)
          .then((r) => r.json())
          .then((data) => setContent({ ...defaultContent, ...data }))
          .catch(() => {});
        return;
      }
      const { data, error } = await supabase
        .from("wedding_content")
        .select("data")
        .eq("id", slug)
        .maybeSingle();
      if (!error && data?.data) {
        setContent({ ...defaultContent, ...(data.data as object) });
      } else {
        fetch(`/api/content?wedding=${slug}&t=${Date.now()}`)
          .then((r) => r.json())
          .then((apiData) => setContent({ ...defaultContent, ...apiData }))
          .catch(() => {});
      }
    };
  }, [slug]);

  useEffect(() => {
    const first = pathname?.split("/").filter(Boolean)[0];
    if (!first || RESERVED.includes(first)) return;
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
  }, [pathname, fetchContent]);

  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
