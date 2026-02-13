import { NextResponse } from "next/server";
import { getAdminSession, getMasterSession } from "@/lib/auth";

export async function GET(request: Request) {
  const cookie = request.headers.get("cookie") ?? "";
  const role = new URL(request.url).searchParams.get("role");
  if (role === "admin") {
    const session = getAdminSession(cookie);
    return NextResponse.json(session ? { role: "admin", email: session.email } : { session: null });
  }
  if (role === "master") {
    const session = getMasterSession(cookie);
    return NextResponse.json(session ? { role: "master", email: session.email } : { session: null });
  }
  return NextResponse.json({ error: "?role=admin or ?role=master required" }, { status: 400 });
}
