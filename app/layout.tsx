import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes, Raleway } from "next/font/google";
import "./globals.css";
import { ContentProvider } from "../components/ContentProvider";
import { DocumentTitle } from "../components/DocumentTitle";
import { getWeddingContent } from "../lib/get-content";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "600"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-great-vibes",
  weight: "400",
});

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWeddingContent();
  const coupleNames = content?.coupleNames || "Wedding Invitation";
  const title = `${coupleNames} · Wedding Invitation`;
  return {
    title,
    description: "A modern, cinematic wedding invitation experience.",
    openGraph: {
      title,
      description: "A modern, cinematic wedding invitation experience.",
    },
    twitter: {
      card: "summary_large_image",
      title,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${greatVibes.variable} ${raleway.variable} font-sans bg-ink-900 text-champagne-50`}
      >
        <ContentProvider>
          <DocumentTitle />
          {children}
        </ContentProvider>
      </body>
    </html>
  );
}

