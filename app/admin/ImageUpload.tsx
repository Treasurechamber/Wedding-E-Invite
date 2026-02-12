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
    <div className="flex items-center gap-3">
      {value ? (
        <img src={value} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover border border-white/10" />
      ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/20 bg-ink-900/50 text-xs text-slate-500">
          {placeholder}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL or browse to upload"
          className="w-full rounded-lg border border-white/10 bg-ink-900/80 px-3 py-2 text-sm text-champagne-50 placeholder-slate-500 focus:border-gold-500/50 focus:outline-none"
        />
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="shrink-0 rounded-lg border border-gold-500/50 bg-gold-500/20 px-3 py-2 text-sm text-gold-400 transition hover:bg-gold-500/30 disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Browse"}
      </button>
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
