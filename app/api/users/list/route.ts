import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { SUPABASE_URL } = await import("../../../../lib/supabase-config");
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(url, key, {
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

  const [masterRes, adminRes] = await Promise.all([
    supabase.from("master_users").select("email").order("email"),
    supabase.from("admin_users").select("email").order("email"),
  ]);

  return NextResponse.json({
    masters: masterRes.data ?? [],
    admins: adminRes.data ?? [],
  });
}
