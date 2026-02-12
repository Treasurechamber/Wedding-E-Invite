"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useContent } from "./ContentProvider";

export function DocumentTitle() {
  const pathname = usePathname();
  const content = useContent();

  useEffect(() => {
    if (pathname?.startsWith("/master")) {
      document.title = "Dashboard";
    } else if (pathname?.startsWith("/admin")) {
      document.title = "Admin";
    } else if (pathname === "/") {
      document.title = `${content.coupleNames} · Wedding Invitation`;
    }
  }, [pathname, content.coupleNames]);

  return null;
}
