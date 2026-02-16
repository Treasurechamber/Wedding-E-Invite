import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase not configured; RSVP logged only");
      console.log("RSVP:", body);
      return NextResponse.json({ ok: true });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const weddingId = body.wedding_id || "default";
    const { error } = await supabase.from("rsvps").insert({
      wedding_id: weddingId,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      attending: body.attending,
      guest_count: body.guest_count,
      plus_one_name: body.plus_one_name,
      message: body.message,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to save RSVP" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("RSVP API error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
