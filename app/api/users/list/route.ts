import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getMasterSession } from "@/lib/auth";

export async function GET(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const session = getMasterSession(request.headers.get("cookie"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: masterRow } = await supabase
    .from("master_users")
    .select("email")
    .eq("email", session.email)
    .maybeSingle();
  if (!masterRow) {
    return NextResponse.json({ error: "Master access required" }, { status: 403 });
  }

  const [masterRes, adminRes] = await Promise.all([
    supabase.from("master_users").select("email").order("email"),
    supabase.from("admin_users").select("email, created_at").order("email"),
  ]);

  return NextResponse.json({
    masters: masterRes.data ?? [],
    admins: adminRes.data ?? [],
  });
}
