"use client";

import { createClient } from "@supabase/supabase-js";
import { LogIn, LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ContentEditor } from "../admin/ContentEditor";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type Session = { role: string; email: string } | null;

export default function MasterPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSession = useCallback(async () => {
    const res = await fetch("/api/auth/session?role=master", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (data.email) setSession({ role: "master", email: data.email });
    else setSession(null);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/master-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
      credentials: "include",
    });
    setLoading(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setSession({ role: "master", email: data.email ?? email });
    } else {
      setError(data.error ?? "Login failed");
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout?role=master", { method: "POST", credentials: "include" });
    setSession(null);
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
          <ContentEditor supabase={supabase} />
        </div>
      </div>
    </div>
  );
}
