import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const SALT_LEN = 16;
const HASH_ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha512";

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LEN, DIGEST).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const computed = pbkdf2Sync(password, salt, HASH_ITERATIONS, KEY_LEN, DIGEST);
  const storedBuf = Buffer.from(hash, "hex");
  if (computed.length !== storedBuf.length) return false;
  return timingSafeEqual(computed, storedBuf);
}

const SECRET = process.env.AUTH_SECRET ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "fallback-secret";
const COOKIE_NAME_ADMIN = "wedding-admin-session";
const COOKIE_NAME_MASTER = "wedding-master-session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = { role: "admin"; email: string } | { role: "master"; email: string };

function sign(payload: Session): string {
  const data = JSON.stringify(payload);
  const signature = createHash("sha256").update(SECRET + data).digest("hex");
  return Buffer.from(`${data}::${signature}`).toString("base64url");
}

function verify(token: string): Session | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const [data, sig] = raw.split("::");
    if (!data || !sig) return null;
    const expected = createHash("sha256").update(SECRET + data).digest("hex");
    const sigBuf = Buffer.from(sig, "utf8");
    const expBuf = Buffer.from(expected, "utf8");
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
    const payload = JSON.parse(data) as Session;
    if (payload.role !== "admin" && payload.role !== "master") return null;
    if (!payload.email || typeof payload.email !== "string") return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminSession(cookieHeader: string | null): Session | null {
  const match = cookieHeader?.match(new RegExp(`${COOKIE_NAME_ADMIN}=([^;]+)`));
  const token = match?.[1];
  if (!token) return null;
  const s = verify(token);
  return s?.role === "admin" ? s : null;
}

export function getMasterSession(cookieHeader: string | null): Session | null {
  const match = cookieHeader?.match(new RegExp(`${COOKIE_NAME_MASTER}=([^;]+)`));
  const token = match?.[1];
  if (!token) return null;
  const s = verify(token);
  return s?.role === "master" ? s : null;
}

export function setAdminCookie(session: Session): string {
  const token = sign(session);
  return `${COOKIE_NAME_ADMIN}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function setMasterCookie(session: Session): string {
  const token = sign(session);
  return `${COOKIE_NAME_MASTER}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function clearAdminCookie(): string {
  return `${COOKIE_NAME_ADMIN}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function clearMasterCookie(): string {
  return `${COOKIE_NAME_MASTER}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
