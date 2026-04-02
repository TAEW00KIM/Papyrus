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
    <footer className="flex items-center gap-1 px-6 py-2 bg-gray-50/80 backdrop-blur-sm border-t border-gray-100 text-[11px] text-gray-400 font-medium tabular-nums">
      <span>{stats.chars.toLocaleString()} 글자</span>
      <span className="text-gray-200 mx-1.5">·</span>
      <span>{stats.words.toLocaleString()} 단어</span>
      <span className="text-gray-200 mx-1.5">·</span>
      <span>약 {stats.readingTime}분</span>
    </footer>
  );
}
