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
    <footer className="flex items-center gap-4 px-6 py-2 border-t border-gray-200 bg-white text-xs text-gray-500">
      <span>{stats.chars.toLocaleString()} 글자</span>
      <span>{stats.words.toLocaleString()} 단어</span>
      <span>약 {stats.readingTime}분 읽기</span>
    </footer>
  );
}
