import type { Metadata } from "next";
import { getWeddingContent } from "../../lib/get-content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getWeddingContent(slug);
  const coupleNames = content?.coupleNames || "Wedding Invitation";
  const title = `${coupleNames} · Wedding Invitation`;
  return {
    title,
    description: "A modern, cinematic wedding invitation experience.",
    openGraph: { title, description: "A modern, cinematic wedding invitation experience." },
    twitter: { card: "summary_large_image", title },
  };
}

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
