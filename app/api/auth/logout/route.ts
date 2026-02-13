import { NextResponse } from "next/server";
import { clearAdminCookie, clearMasterCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const role = url.searchParams.get("role"); // "admin" | "master"
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  if (role === "admin") {
    headers.append("Set-Cookie", clearAdminCookie());
  } else if (role === "master") {
    headers.append("Set-Cookie", clearMasterCookie());
  } else {
    headers.append("Set-Cookie", clearAdminCookie());
    headers.append("Set-Cookie", clearMasterCookie());
  }
  return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers });
}
