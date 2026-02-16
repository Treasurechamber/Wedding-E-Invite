import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const { SUPABASE_URL } = await import("../../../../lib/supabase-config");
  const url = SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return NextResponse.json({ weddings: [] });

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("wedding_content")
    .select("id, data")
    .order("id");
  const weddings = (data ?? []).map((r) => ({
    id: r.id,
    coupleNames: (r.data as { coupleNames?: string })?.coupleNames ?? r.id,
  }));
  return NextResponse.json({ weddings });
}
