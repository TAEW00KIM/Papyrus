"use client";

import { useEffect, useState, useRef } from "react";
import { renderMarkdown } from "@/lib/markdown";

interface PreviewProps {
  markdown: string;
  theme?: string;
}

export function Preview({ markdown: md, theme = "default" }: PreviewProps) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const result = await renderMarkdown(md);
      setHtml(result);
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [md]);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto p-8 prose prose-neutral max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
