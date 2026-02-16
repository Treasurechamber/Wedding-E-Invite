export type ThemeId = "gold" | "rose" | "minimal";

export type WeddingContent = {
  theme?: ThemeId;
  coupleNames: string;
  coupleInitials: string;
  weddingDate: string;
  weddingDateDisplay: string;
  weddingTime: string;
  rsvpDeadline: string;
  hashtag: string;
  heroSlides: string[];
  ceremony: { name: string; time: string; address: string; mapUrl: string };
  reception: { name: string; time: string; address: string; mapUrl: string };
  events: { time: string; title: string }[];
  venueCards: { title: string; subtitle: string; src: string }[];
  mapEmbedUrl: string;
};
