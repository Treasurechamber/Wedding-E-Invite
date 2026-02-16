"use client";

import { LogOut, Users, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type Session = { role: string; email: string } | null;

export default function ManageUsersPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"master" | "admin">("master");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [masters, setMasters] = useState<{ email: string }[]>([]);
  const [admins, setAdmins] = useState<{ email: string }[]>([]);

  const fetchSession = useCallback(async () => {
    const res = await fetch("/api/auth/session?role=master", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    if (data.email) setSession({ role: "master", email: data.email });
    else setSession(null);
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/users/list", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setMasters(data.masters ?? []);
      setAdmins(data.admins ?? []);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (session) fetchUsers();
  }, [session, fetchUsers]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setMessage({ type: "err", text: "Email and password required" });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "err", text: "Password must be at least 6 characters" });
      return;
    }
    setLoading(true);
    setMessage(null);
    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email: email.trim(), password }),
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (res.ok) {
      setMessage({ type: "ok", text: data.message ?? "User created" });
      setEmail("");
      setPassword("");
      fetchUsers();
    } else {
      setMessage({ type: "err", text: data.error ?? "Failed to create user" });
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout?role=master", { method: "POST", credentials: "include" });
    setSession(null);
  };

  if (session === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-900 p-4">
        <div className="text-center">
          <p className="text-slate-400">You must be logged in as Master to manage users.</p>
          <Link
            href="/master"
            className="mt-4 inline-block text-gold-400 underline hover:text-gold-300"
          >
            Go to Master Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-900 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-script text-3xl text-gold-400 flex items-center gap-2">
            <Users className="h-8 w-8" /> Manage Users
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/master"
              className="text-sm text-slate-400 hover:text-gold-400"
            >
              ← Back to Content
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-ink-800"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          <section className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
            <h2 className="font-serif text-lg text-gold-400 flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5" /> Create User
            </h2>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "master" | "admin")}
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 focus:border-gold-500/50 focus:outline-none"
                >
                  <option value="master">Master (edit wedding content)</option>
                  <option value="admin">Admin (view RSVPs only)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Password (min 6 characters)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-ink-900/80 px-4 py-3 text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
              {message && (
                <p className={message.type === "ok" ? "text-emerald-400" : "text-amber-400"}>
                  {message.text}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-ink-900 transition hover:bg-gold-400 disabled:opacity-70"
              >
                <UserPlus className="h-4 w-4" /> Create {role === "master" ? "Master" : "Admin"} User
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/10 bg-ink-800/60 p-6">
            <h2 className="font-serif text-lg text-gold-400 mb-4">Current Users</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Master users</h3>
                <ul className="space-y-1 text-champagne-50">
                  {masters.length === 0 && <li className="text-slate-500">None</li>}
                  {masters.map((u) => (
                    <li key={u.email} className="text-sm">{u.email}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Admin users</h3>
                <ul className="space-y-1 text-champagne-50">
                  {admins.length === 0 && <li className="text-slate-500">None</li>}
                  {admins.map((u) => (
                    <li key={u.email} className="text-sm">{u.email}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
