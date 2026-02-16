import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./supabase-config";

const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabase =
  supabaseKey ? createClient(SUPABASE_URL, supabaseKey) : null;
