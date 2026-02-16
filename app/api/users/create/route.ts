import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
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

  const adminSupabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: createError } = await adminSupabase.auth.admin.createUser({
    email: emailNorm,
    password,
    email_confirm: true,
  });

  if (createError) {
    if (createError.message.includes("already been registered") && roleNorm === "master") {
      // User exists – ensure in master_users
    } else if (!createError.message.includes("already been registered")) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }
  }

  if (roleNorm === "master") {
    await adminSupabase
      .from("master_users")
      .upsert({ email: emailNorm }, { onConflict: "email" });
  } else {
    await adminSupabase
      .from("admin_users")
      .upsert({ email: emailNorm, password_hash: "supabase" }, { onConflict: "email" });
  }

  return NextResponse.json({
    ok: true,
    message: `${roleNorm === "master" ? "Master" : "Admin"} user ${emailNorm} created.`,
  });
}
