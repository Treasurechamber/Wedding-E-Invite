import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user?.email) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { data: masterRow } = await supabase
    .from("master_users")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();
  if (!masterRow) {
    return NextResponse.json({ error: "Master access required" }, { status: 403 });
  }

  let body: { data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.data) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const { error } = await supabase
    .from("wedding_content")
    .upsert(
      { id: "default", data: body.data, updated_at: new Date().toISOString() },
      { onConflict: "id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
