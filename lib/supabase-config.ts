/**
 * Supabase URL – fixes common mistake: if you set just the project ID
 * (e.g. "pixvfdqxrgslkrfswopn") instead of full URL, we fix it here.
 */
const raw = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_URL =
  raw.startsWith("https://")
    ? raw
    : raw && /^[a-z0-9-]+$/.test(raw)
      ? `https://${raw}.supabase.co`
      : raw || "https://pixvfdqxrgslkrfswopn.supabase.co";
