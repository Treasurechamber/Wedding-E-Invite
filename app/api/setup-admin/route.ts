import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!serviceKey || !supabaseUrl) {
    return NextResponse.json(
      { error: "Add SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL to env" },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Body must include email and password" },
      { status: 400 }
    );
  }

  const emailNorm = email.trim().toLowerCase();
  const passwordHash = hashPassword(password);

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error: insertError } = await supabase
    .from("admin_users")
    .upsert({ email: emailNorm, password_hash: passwordHash }, { onConflict: "email" });

  if (insertError) {
    return NextResponse.json(
      { error: `Failed to create admin user: ${insertError.message}` },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: `Admin user ${emailNorm} is ready. You can now log in at /admin.`,
  });
}
