"use client";

import { createClient, Session } from "@supabase/supabase-js";
import { LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentEditor } from "../admin/ContentEditor";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function MasterPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMaster, setIsMaster] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase || !session?.user?.email) {
      setIsMaster(null);
      return;
    }
    supabase
      .from("master_users")
      .select("email")
      .eq("email", session.user.email)
      .maybeSingle()
      .then(({ data }) => setIsMaster(!!data));
  }, [session]);

  const login = async () => {
    setLoading(true);
    setError("");
    const { error: e } = await supabase!.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (e) setError(e.message);
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setIsMaster(null);
  };

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <p className="text-slate-400">Supabase not configured.</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-800/80 p-8">
          <h1 className="font-script text-2xl text-gold-400">Master Login</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to edit wedding content</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-6 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
          />
          {error && <p className="mt-2 text-sm text-amber-400">{error}</p>}
          <button
            onClick={login}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 py-3 text-ink-900 transition hover:bg-gold-400 disabled:opacity-70"
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isMaster === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-ink-800/80 p-8 text-center">
          <h1 className="font-script text-2xl text-amber-400">Access Denied</h1>
          <p className="mt-3 text-slate-300">
            Your account does not have permission to edit content. This area is for site owners only.
          </p>
          <button
            onClick={logout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-slate-300 hover:bg-ink-800"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (isMaster === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <p className="text-slate-400">Checking access…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-script text-3xl text-gold-400">Master Content</h1>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
        <div className="mt-8">
          <ContentEditor supabase={supabase} accessToken={session?.access_token} />
        </div>
      </div>
    </div>
  );
}
