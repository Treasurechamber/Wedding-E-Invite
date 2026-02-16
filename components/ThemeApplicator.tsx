"use client";

import { useEffect } from "react";
import { useContent } from "./ContentProvider";
import { DEFAULT_THEME } from "../lib/themes";
import type { ThemeId } from "../lib/content-types";

export function ThemeApplicator() {
  const content = useContent();
  const theme = (content.theme as ThemeId) || DEFAULT_THEME;

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    return () => {
      document.body.setAttribute("data-theme", DEFAULT_THEME);
    };
  }, [theme]);

  return null;
}
