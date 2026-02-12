"use client";

import { createClient, Session } from "@supabase/supabase-js";
import * as XLSX from "xlsx";
import { LogIn, LogOut, Search, Download } from "lucide-react";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

type RSVP = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string | null;
  attending: boolean;
  guest_count: number;
  plus_one_name: string | null;
  dietary_restrictions: string[] | null;
  dietary_notes: string | null;
  song_request: string | null;
  message: string | null;
};

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "attending" | "declined">("all");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s ?? null));
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) return;
    const q = supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    q.then(({ data, error: e }) => {
      if (!e) setRsvps((data ?? []) as RSVP[]);
    });
    const ch = supabase
      .channel("rsvps")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "rsvps" }, () => {
        supabase.from("rsvps").select("*").order("created_at", { ascending: false }).then(({ data }) => {
          if (data) setRsvps(data as RSVP[]);
        });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [supabase, session]);

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
  };

  const filtered = rsvps.filter((r) => {
    const matchSearch =
      !search ||
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "attending" && r.attending) ||
      (filter === "declined" && !r.attending);
    return matchSearch && matchFilter;
  });

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter((r) => r.attending).length,
    declined: rsvps.filter((r) => !r.attending).length,
    guests: rsvps.filter((r) => r.attending).reduce((s, r) => s + r.guest_count, 0),
  };

  const exportXlsx = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Attending",
      "Guests",
      "Plus One",
      "Dietary",
      "Song",
      "Message",
    ];
    const rows = filtered.map((r) => [
      r.full_name,
      r.email,
      r.phone ?? "",
      r.attending ? "Yes" : "No",
      r.guest_count,
      r.plus_one_name ?? "",
      (r.dietary_restrictions ?? []).join("; "),
      r.song_request ?? "",
      r.message ?? "",
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "RSVPs");
    XLSX.writeFile(wb, "rsvps.xlsx");
  };

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <p className="text-slate-400">Supabase not configured. Add env vars.</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-ink-800/80 p-8">
          <h1 className="font-script text-2xl text-gold-400">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage RSVPs</p>
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
          <h1 className="font-script text-3xl text-gold-400">RSVP Admin</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
            <p className="text-sm text-slate-400">Total RSVPs</p>
            <p className="text-2xl font-semibold text-champagne-50">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
            <p className="text-sm text-slate-400">Attending</p>
            <p className="text-2xl font-semibold text-emerald-400">{stats.attending}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
            <p className="text-sm text-slate-400">Declined</p>
            <p className="text-2xl font-semibold text-amber-400">{stats.declined}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-800/60 p-4">
            <p className="text-sm text-slate-400">Total Guests</p>
            <p className="text-2xl font-semibold text-gold-400">{stats.guests}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-800/80 py-2 pl-10 pr-4 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="rounded-xl border border-white/10 bg-ink-800/80 px-4 py-2 text-champagne-50 focus:border-gold-500/50 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="attending">Attending</option>
            <option value="declined">Declined</option>
          </select>
          <button
            onClick={exportXlsx}
            className="flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2 text-ink-900 transition hover:bg-gold-400"
          >
            <Download className="h-4 w-4" /> Export XLSX
          </button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-ink-800/60">
                <th className="p-4 font-serif text-sm text-gold-400">Name</th>
                <th className="p-4 font-serif text-sm text-gold-400">Email</th>
                <th className="p-4 font-serif text-sm text-gold-400">Attending</th>
                <th className="p-4 font-serif text-sm text-gold-400">Guests</th>
                <th className="p-4 font-serif text-sm text-gold-400">Dietary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="p-4 text-slate-200">{r.full_name}</td>
                  <td className="p-4 text-slate-400">{r.email}</td>
                  <td className="p-4">
                    <span className={r.attending ? "text-emerald-400" : "text-amber-400"}>
                      {r.attending ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{r.guest_count}</td>
                  <td className="p-4 text-slate-400">
                    {(r.dietary_restrictions ?? []).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
