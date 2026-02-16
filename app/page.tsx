"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/default");
  }, [router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900">
      <p className="text-slate-400">Redirecting…</p>
    </div>
  );
}
