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

const defaultContent: WeddingContent = {
  coupleNames: "Sophia & Alexander",
  coupleInitials: "S & A",
  weddingDate: "2025-09-14T16:00:00",
  weddingDateDisplay: "September 14, 2025",
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

  const fetchContent = () => {
    fetch(`/api/content?t=${Date.now()}`)
      .then((r) => r.json())
      .then((data) => setContent({ ...defaultContent, ...data }))
      .catch(() => {});
  };

  useEffect(() => {
    fetchContent();
    const interval = setInterval(fetchContent, 3000); // Refetch every 3 seconds
    const onFocus = () => fetchContent();
    window.addEventListener("visibilitychange", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  // Refetch when navigating to home page (e.g. after editing in Dashboard)
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
