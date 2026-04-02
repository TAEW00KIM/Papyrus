"use client";

import { useMemo } from "react";

interface StatusBarProps {
  markdown: string;
}

export function StatusBar({ markdown }: StatusBarProps) {
  const stats = useMemo(() => {
    const chars = markdown.length;
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { chars, words, readingTime };
  }, [markdown]);

  return (
    <footer className="flex items-center h-[30px] px-5 bg-white border-t border-black/[0.04] text-[11px] text-gray-400 font-medium tabular-nums tracking-wide">
      <span>{stats.chars.toLocaleString()} 글자</span>
      <span className="text-gray-300 mx-2">·</span>
      <span>{stats.words.toLocaleString()} 단어</span>
      <span className="text-gray-300 mx-2">·</span>
      <span>약 {stats.readingTime}분</span>
    </footer>
  );
}
