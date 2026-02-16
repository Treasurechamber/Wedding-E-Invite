import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
const DEFAULT_DATA = {
  theme: "gold" as const,
  coupleNames: "New Couple",
  coupleInitials: "N & C",
  weddingDate: "2026-06-15T16:00:00",
  weddingDateDisplay: "June 15, 2026",
  weddingTime: "4:00 PM",
  rsvpDeadline: "June 1, 2026",
  hashtag: "#NewCouple2026",
  heroSlides: [
    "https://images.pexels.com/photos/265722/pexels-photo-265722.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  ceremony: { name: "", time: "", address: "", mapUrl: "" },
  reception: { name: "", time: "", address: "", mapUrl: "" },
  events: [{ time: "4:00 PM", title: "Ceremony" }],
  venueCards: [],
  mapEmbedUrl: "",
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s*&\s*/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "wedding";
}

export async function POST(request: Request) {
  const { SUPABASE_URL } = await import("../../../../lib/supabase-config");
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user?.email) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const { data: masterRow } = await supabase
    .from("master_users")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  if (!masterRow) return NextResponse.json({ error: "Master required" }, { status: 403 });

  let body: { slug?: string; coupleNames?: string; adminEmails?: string[]; theme?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const slug = (body.slug ?? slugify(body.coupleNames ?? "wedding")).toLowerCase().replace(/[^a-z0-9-]/g, "-") || "wedding";
  const adminEmails = (body.adminEmails ?? []) as string[];
  const theme = ["gold", "rose", "minimal"].includes(String(body.theme ?? "")) ? body.theme : "gold";

  const { error } = await supabase
    .from("wedding_content")
    .insert({ id: slug, data: { ...DEFAULT_DATA, theme, coupleNames: body.coupleNames ?? "New Couple" } });

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: `Wedding "${slug}" already exists` }, { status: 400 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const email of adminEmails) {
    const e = String(email).trim().toLowerCase();
    if (e) await supabase.from("wedding_admins").upsert({ wedding_id: slug, email: e }, { onConflict: "wedding_id,email" });
  }

  return NextResponse.json({ ok: true, slug, message: `Wedding ${slug} created. Share: /${slug}` });
}
