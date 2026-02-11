"use client";

import { Countdown } from "../components/Countdown";
import { EnvelopeGate } from "../components/EnvelopeGate";
import { Footer } from "../components/Footer";
import { HeroCarousel } from "../components/HeroCarousel";
import { RSVPForm } from "../components/RSVPForm";
import { ScheduleSection } from "../components/ScheduleSection";
import { VenueSection } from "../components/VenueSection";
import { useState } from "react";

export default function Page() {
  const [gateDone, setGateDone] = useState(false);

  return (
    <>
      <main>
        <HeroCarousel />
        <Countdown />
        <VenueSection />
        <ScheduleSection />
        <RSVPForm />
        <Footer />
      </main>
      {!gateDone && <EnvelopeGate onOpened={() => setGateDone(true)} />}
    </>
  );
}

