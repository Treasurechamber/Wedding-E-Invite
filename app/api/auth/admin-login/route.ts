import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { setAdminCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "Server not configured" }, { status: 500 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: row, error } = await supabase
    .from("admin_users")
    .select("email, password_hash")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !row?.password_hash) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  if (!verifyPassword(password, row.password_hash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const session = { role: "admin" as const, email: row.email };
  return new NextResponse(JSON.stringify({ ok: true, email: row.email }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": setAdminCookie(session),
    },
  });
}
