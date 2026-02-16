"use client";

import { createClient, Session } from "@supabase/supabase-js";
import { LogIn, LogOut, Users, Plus, Trash2, Pencil, Copy, RefreshCw } from "lucide-react";
import { THEMES } from "../../lib/themes";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ContentEditor } from "../admin/ContentEditor";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, { auth: { storageKey: "sb-master-auth" } })
    : null;

type Wedding = { id: string; coupleNames: string };

export default function MasterPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMaster, setIsMaster] = useState<boolean | null>(null);
  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<string>("default");
  const [showCreate, setShowCreate] = useState(false);
  const [newSlug, setNewSlug] = useState("");
  const [newCoupleNames, setNewCoupleNames] = useState("");
  const [newAdminEmails, setNewAdminEmails] = useState("");
  const [newTheme, setNewTheme] = useState<"gold" | "rose" | "minimal">("gold");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [weddingToDelete, setWeddingToDelete] = useState<Wedding | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const fetchWeddings = useCallback(async () => {
    const res = await fetch(`/api/weddings/list?t=${Date.now()}`);
    const data = await res.json().catch(() => ({}));
    const list = (data.weddings ?? []) as Wedding[];
    setWeddings(list);
    if (list.length > 0 && !list.some((w) => w.id === selectedWedding)) {
      setSelectedWedding(list[0].id);
    }
  }, [selectedWedding]);

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

  useEffect(() => {
    if (session && isMaster) fetchWeddings();
  }, [session, isMaster, fetchWeddings]);

  const login = async () => {
    setLoading(true);
    setError("");
    const { error: e } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (e) setError(e.message);
  };

  const logout = async () => {
    await supabase?.auth.signOut();
    setSession(null);
    setIsMaster(null);
  };

  const createWedding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.access_token) return;
    const slug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "wedding";
    const adminEmails = newAdminEmails
      .split(/[,;\s]+/)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    setLoading(true);
    setError("");
    const res = await fetch("/api/weddings/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        slug,
        coupleNames: newCoupleNames || "New Couple",
        adminEmails,
        theme: newTheme,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setShowCreate(false);
      setNewSlug("");
      setNewCoupleNames("");
      setNewAdminEmails("");
      setNewTheme("gold");
      fetchWeddings();
      setSelectedWedding(data.slug ?? slug);
    } else {
      setError(data.error ?? "Failed to create");
    }
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const openDeleteConfirm = (w: Wedding) => {
    setWeddingToDelete(w);
    setShowDeleteConfirm(true);
    setError("");
  };

  const deleteWedding = async () => {
    const id = weddingToDelete?.id;
    if (!id || !session?.access_token) return;
    setDeleting(true);
    setError("");
    const res = await fetch("/api/weddings/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ weddingId: id }),
    });
    const data = await res.json().catch(() => ({}));
    setDeleting(false);
    setShowDeleteConfirm(false);
    setWeddingToDelete(null);
    if (res.ok) {
      const remaining = weddings.filter((w) => w.id !== id);
      setWeddings(remaining);
      if (selectedWedding === id) setSelectedWedding(remaining[0]?.id ?? "");
    } else {
      setError(data.error ?? "Failed to delete");
    }
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
        <div className="max-w-md rounded-2xl border border-amber-500/30 bg-ink-800/80 p-8 text-center">
          <h1 className="font-script text-2xl text-amber-400">Access Denied</h1>
          <p className="mt-3 text-slate-300">Add your email to master_users first.</p>
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
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fetchWeddings()}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
              title="Refresh weddings list"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
            >
              <Plus className="h-4 w-4" /> New Wedding
            </button>
            <Link
              href="/manage"
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
            >
              <Users className="h-4 w-4" /> Manage Users
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {showCreate && (
          <form onSubmit={createWedding} className="mt-6 rounded-2xl border border-gold-500/30 bg-ink-800/60 p-6">
            <h2 className="font-serif text-lg text-gold-400 mb-4">Create Wedding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Theme</label>
                <select
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value as "gold" | "rose" | "minimal")}
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-2 text-champagne-50 focus:border-gold-500/50 focus:outline-none"
                >
                  {THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">URL slug (e.g. anthony-yara)</label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="anthony-yara"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-2 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Couple names</label>
                <input
                  type="text"
                  value={newCoupleNames}
                  onChange={(e) => setNewCoupleNames(e.target.value)}
                  placeholder="Anthony & Yara"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-2 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Admin emails (comma-separated) – couple can view RSVPs</label>
                <input
                  type="text"
                  value={newAdminEmails}
                  onChange={(e) => setNewAdminEmails(e.target.value)}
                  placeholder="couple@example.com, spouse@example.com"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-2 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              {error && <p className="text-amber-400">{error}</p>}
              <div className="flex gap-2">
                <button type="submit" disabled={loading} className="rounded-xl bg-gold-500 px-6 py-2 text-ink-900 hover:bg-gold-400 disabled:opacity-70">
                  Create
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-white/10 px-6 py-2 text-slate-400 hover:bg-ink-800">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {weddings.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-lg text-gold-400 mb-4">All Weddings</h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10 bg-ink-800/60">
                    <th className="p-3 font-serif text-sm text-gold-400">Couple</th>
                    <th className="p-3 font-serif text-sm text-gold-400">Slug</th>
                    <th className="p-3 font-serif text-sm text-gold-400">Wedding Link</th>
                    <th className="p-3 font-serif text-sm text-gold-400">Admin Link</th>
                    <th className="p-3 font-serif text-sm text-gold-400 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weddings.map((w) => {
                    const weddingUrl = `${baseUrl}/${w.id}`;
                    const adminUrl = `${baseUrl}/admin`;
                    return (
                      <tr
                        key={w.id}
                        className={`border-b border-white/5 hover:bg-ink-800/40 ${selectedWedding === w.id ? "bg-ink-800/60" : ""}`}
                      >
                        <td className="p-3 text-champagne-50 font-serif">{w.coupleNames}</td>
                        <td className="p-3 text-slate-400 font-mono text-sm">{w.id}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={weddingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-400 hover:underline text-sm truncate max-w-[180px]"
                            >
                              {weddingUrl}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyLink(weddingUrl, `wedding-${w.id}`)}
                              className="shrink-0 rounded p-1 text-slate-400 hover:text-gold-400"
                              title="Copy wedding link"
                            >
                              {copiedLink === `wedding-${w.id}` ? (
                                <span className="text-xs text-emerald-400">Copied!</span>
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <a
                              href={adminUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-400 hover:underline text-sm"
                            >
                              {adminUrl}
                            </a>
                            <button
                              type="button"
                              onClick={() => copyLink(adminUrl, `admin-${w.id}`)}
                              className="shrink-0 rounded p-1 text-slate-400 hover:text-gold-400"
                              title="Copy admin link"
                            >
                              {copiedLink === `admin-${w.id}` ? (
                                <span className="text-xs text-emerald-400">Copied!</span>
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedWedding(w.id)}
                              className="rounded px-2 py-1 text-xs text-gold-400 hover:bg-ink-800"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteConfirm(w)}
                              className="rounded p-1 text-red-400 hover:bg-red-500/10"
                              title="Delete wedding"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {weddings.length > 0 && selectedWedding && (
          <div className="mt-8" id="edit-content">
            <div className="mb-2 flex items-center gap-2">
              <Pencil className="h-4 w-4 text-gold-400" />
              <span className="text-sm text-slate-400">
                Editing: {weddings.find((w) => w.id === selectedWedding)?.coupleNames ?? selectedWedding} · <a href={`/${selectedWedding}`} target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">View live</a>
              </span>
            </div>
            <ContentEditor supabase={supabase} accessToken={session?.access_token} weddingId={selectedWedding} onSaveSuccess={fetchWeddings} />
          </div>
        )}

        {showDeleteConfirm && weddingToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-2xl border border-red-500/30 bg-ink-800 p-6">
              <h3 className="font-serif text-lg text-red-400">Delete Wedding?</h3>
              <p className="mt-3 text-sm text-slate-300">
                Remove <strong>{weddingToDelete.coupleNames}</strong> ({weddingToDelete.id})? This will delete the wedding, its content, and all RSVPs. This cannot be undone.
              </p>
              {error && <p className="mt-2 text-sm text-amber-400">{error}</p>}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={deleteWedding}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600 py-2 text-white transition hover:bg-red-500 disabled:opacity-70"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setWeddingToDelete(null); setError(""); }}
                  className="flex-1 rounded-xl border border-white/10 py-2 text-slate-300 hover:bg-ink-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {weddings.length === 0 && !showCreate && (
          <p className="mt-8 text-slate-400">No weddings yet. Click &quot;New Wedding&quot; to create one.</p>
        )}

        <div className="mt-12 rounded-xl border border-white/5 bg-ink-800/40 px-4 py-3 text-center">
          <p className="text-xs text-slate-500">
            Connected to: <span className="font-mono text-slate-400">{process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)"}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            This must match your Supabase project URL. If data is wrong, update Vercel env vars and redeploy. See SUPABASE_SETUP.md
          </p>
        </div>
      </div>
    </div>
  );
}
