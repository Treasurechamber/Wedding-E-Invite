"use client";

import { useRef, useState } from "react";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  placeholder?: string;
};

export function ImageUpload({ value, onChange, onUpload, placeholder = "No image" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch {
      // ignore
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {value ? (
        <img src={value} alt="" className="h-20 w-28 shrink-0 rounded-lg object-cover border border-white/10" />
      ) : (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-lg border-2 border-dashed border-gold-500/40 bg-ink-900/50 text-xs text-slate-500">
          {placeholder}
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste URL or click Browse"
          className="flex-1 rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sm text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 rounded-lg bg-gold-500 px-4 py-2.5 text-sm font-medium text-ink-900 transition hover:bg-gold-400 disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? "Uploading…" : "📁 Browse / Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
