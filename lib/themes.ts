import type { ThemeId } from "./content-types";

export const THEMES: { id: ThemeId; name: string }[] = [
  { id: "gold", name: "Classic Gold" },
  { id: "rose", name: "Rose Garden" },
  { id: "minimal", name: "Minimal White" },
];

export const DEFAULT_THEME: ThemeId = "gold";
