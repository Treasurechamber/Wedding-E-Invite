import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      {
        coupleNames: "Sophia & Alexander",
        coupleInitials: "S & A",
        weddingDate: "2025-09-14T16:00:00",
        weddingDateDisplay: "September 14, 2025",
        weddingTime: "4:00 PM",
        rsvpDeadline: "August 1, 2025",
        hashtag: "#SophiaAndAlexander2025",
        heroSlides: [
          "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/3951915/pexels-photo-3951915.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/265705/pexels-photo-265705.jpeg?auto=compress&cs=tinysrgb&w=1600",
          "https://images.pexels.com/photos/3014856/pexels-photo-3014856.jpeg?auto=compress&cs=tinysrgb&w=1600",
        ],
        ceremony: {
          name: "Al Tawahin (Kalaa Weddings)",
          time: "4:00 PM",
          address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
          mapUrl: "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings)",
        },
        reception: {
          name: "Al Tawahin (Kalaa Weddings) – Grand Hall",
          time: "6:00 PM",
          address: "Al Tawahin (Kalaa Weddings), القلعة، عين بعال",
          mapUrl: "https://www.google.com/maps/dir//Al+Tawahin+(+Kalaa+Weddings)",
        },
        events: [
          { time: "3:30 PM", title: "Guest Arrival" },
          { time: "4:00 PM", title: "Ceremony" },
          { time: "5:00 PM", title: "Cocktail Hour" },
          { time: "6:00 PM", title: "Reception & Dinner" },
          { time: "8:00 PM", title: "First Dance" },
          { time: "11:00 PM", title: "Last Dance" },
        ],
        venueCards: [
          { title: "Garden Terrace", subtitle: "Sunset Ceremony", src: "/venue/k1.jpg" },
          { title: "Grand Hall", subtitle: "Reception & Dinner", src: "/venue/k2.jpg" },
        ],
        mapEmbedUrl:
          "https://www.google.com/maps?q=Al+Tawahin+(Kalaa+Weddings)&output=embed",
      },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("wedding_content")
    .select("data")
    .eq("id", "default")
    .single();

  if (error || !data?.data) {
    return NextResponse.json(
      {
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
      },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" } }
    );
  }

  return NextResponse.json(data.data, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
  });
}
