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

  let body: { role?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { role, email } = body;
  if (!role || !email) {
    return NextResponse.json({ error: "role and email required" }, { status: 400 });
  }

  const roleNorm = role.toLowerCase() as "master" | "admin";
  if (roleNorm !== "master" && roleNorm !== "admin") {
    return NextResponse.json({ error: "role must be master or admin" }, { status: 400 });
  }

  const emailNorm = email.trim().toLowerCase();

  if (emailNorm === user.email) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const targetUser = await findUserByEmail(supabase, emailNorm);
  if (targetUser) {
    await supabase.auth.admin.deleteUser(targetUser.id);
  }

  if (roleNorm === "master") {
    await supabase.from("master_users").delete().eq("email", emailNorm);
  } else {
    await supabase.from("admin_users").delete().eq("email", emailNorm);
  }

  return NextResponse.json({ ok: true, message: `User ${emailNorm} deleted.` });
}
