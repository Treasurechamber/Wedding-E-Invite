import { createClient } from "@supabase/supabase-js";

export async function getWeddingContent(weddingId = "default") {
  const { SUPABASE_URL } = await import("./supabase-config");
  const url = SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  let { data } = await supabase
    .from("wedding_content")
    .select("data")
    .eq("id", weddingId)
    .maybeSingle();

  if (!data?.data && weddingId === "default") {
    const { data: first } = await supabase
      .from("wedding_content")
      .select("data")
      .limit(1)
      .maybeSingle();
    data = first;
  }

  return (data?.data as { coupleNames?: string } | null) ?? null;
}
