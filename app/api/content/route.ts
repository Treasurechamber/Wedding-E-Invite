import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weddingId = searchParams.get("wedding") || "default";
  if (!supabaseUrl || !supabaseAnonKey) {
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
          "https://www.google.com/maps?q=Al+Tawahin+Kalaa+Weddings+Ein+Baal+Lebanon&output=embed",
      },
      { headers: NO_CACHE }
    );
  }

  // Use service role to read (bypasses RLS) so content always loads
  const key = supabaseServiceKey || supabaseAnonKey;
  const supabase = createClient(supabaseUrl, key);
  const { data, error } = await supabase
    .from("wedding_content")
    .select("data")
    .eq("id", weddingId)
    .maybeSingle();

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
          "https://www.google.com/maps?q=Al+Tawahin+Kalaa+Weddings+Ein+Baal+Lebanon&output=embed",
      },
      { headers: NO_CACHE }
    );
  }

  return NextResponse.json(data.data, { headers: NO_CACHE });
}
