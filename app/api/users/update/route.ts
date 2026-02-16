import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

async function findUserByEmail(
  supabase: import("@supabase/supabase-js").SupabaseClient,
  email: string
) {
  const { data } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
}

export async function POST(request: Request) {
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

  let body: { role?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { role, email, password } = body;
  if (!role || !email || !password) {
    return NextResponse.json({ error: "role, email, and password required" }, { status: 400 });
  }

  const roleNorm = role.toLowerCase() as "master" | "admin";
  if (roleNorm !== "master" && roleNorm !== "admin") {
    return NextResponse.json({ error: "role must be master or admin" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const emailNorm = email.trim().toLowerCase();
  const targetUser = await findUserByEmail(supabase, emailNorm);
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { error } = await supabase.auth.admin.updateUserById(targetUser.id, { password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: `Password updated for ${emailNorm}.` });
}
