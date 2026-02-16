import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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

  let body: { weddingId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const weddingId = String(body.weddingId ?? "").trim();
  if (!weddingId) return NextResponse.json({ error: "weddingId required" }, { status: 400 });

  // Delete in order: wedding_admins, rsvps, wedding_content
  const { error: adminsErr } = await supabase
    .from("wedding_admins")
    .delete()
    .eq("wedding_id", weddingId);
  if (adminsErr) return NextResponse.json({ error: adminsErr.message }, { status: 500 });

  const { error: rsvpsErr } = await supabase
    .from("rsvps")
    .delete()
    .eq("wedding_id", weddingId);
  if (rsvpsErr) return NextResponse.json({ error: rsvpsErr.message }, { status: 500 });

  const { error: contentErr } = await supabase
    .from("wedding_content")
    .delete()
    .eq("id", weddingId);
  if (contentErr) return NextResponse.json({ error: contentErr.message }, { status: 500 });

  return NextResponse.json({ ok: true, message: `Wedding ${weddingId} deleted` });
}
