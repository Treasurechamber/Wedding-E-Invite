import { createClient } from "@supabase/supabase-js";

export async function getWeddingContent() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from("wedding_content")
    .select("data")
    .eq("id", "default")
    .maybeSingle();

  return (data?.data as { coupleNames?: string } | null) ?? null;
}
