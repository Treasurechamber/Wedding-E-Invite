"use client";

import { useParams } from "next/navigation";
import { useContent } from "../../components/ContentProvider";
import { Countdown } from "../../components/Countdown";
import { EnvelopeGate } from "../../components/EnvelopeGate";
import { Footer } from "../../components/Footer";
import { RSVPForm } from "../../components/RSVPForm";
import { ScheduleSection } from "../../components/ScheduleSection";
import { ThemeApplicator } from "../../components/ThemeApplicator";
import { VenueSection } from "../../components/VenueSection";
import { HeroGold } from "../../components/themes/HeroGold";
import { HeroMinimal } from "../../components/themes/HeroMinimal";
import { HeroRose } from "../../components/themes/HeroRose";
import { DEFAULT_THEME } from "../../lib/themes";
import { useState } from "react";
import type { ThemeId } from "../../lib/content-types";

export default function WeddingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "default";
  const content = useContent();
  const theme = (content.theme as ThemeId) || DEFAULT_THEME;
  const [gateDone, setGateDone] = useState(false);

  return (
    <>
      <ThemeApplicator />
      <main data-theme={theme}>
        {theme === "gold" && <HeroGold />}
        {theme === "rose" && <HeroRose />}
        {theme === "minimal" && <HeroMinimal />}
        <Countdown />
        <VenueSection />
        <ScheduleSection />
        <RSVPForm weddingId={slug} />
        <Footer />
      </main>
      {theme === "gold" && !gateDone && (
        <EnvelopeGate onOpened={() => setGateDone(true)} />
      )}
    </>
  );
}
