import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { getMasterSession } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
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

  let body: { role?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { role, email, password } = body;
  if (!role || !email || !password) {
    return NextResponse.json(
      { error: "role, email, and password are required" },
      { status: 400 }
    );
  }

  const roleNorm = role.toLowerCase();
  if (roleNorm !== "master" && roleNorm !== "admin") {
    return NextResponse.json({ error: "role must be master or admin" }, { status: 400 });
  }

  const emailNorm = email.trim().toLowerCase();
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const passwordHash = hashPassword(password);

  if (roleNorm === "master") {
    const { error } = await supabase
      .from("master_users")
      .upsert({ email: emailNorm, password_hash: passwordHash }, { onConflict: "email" });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, message: `Master user ${emailNorm} created` });
  }

  const { error } = await supabase
    .from("admin_users")
    .upsert({ email: emailNorm, password_hash: passwordHash }, { onConflict: "email" });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: `Admin user ${emailNorm} created` });
}
