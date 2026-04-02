"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { MermaidRenderer } from "./MermaidRenderer";
import { getThemeClassName } from "@/lib/themes";

interface PreviewProps {
  markdown: string;
  theme?: string;
}

function extractMermaidBlocks(md: string): { cleaned: string; blocks: Map<string, string> } {
  const blocks = new Map<string, string>();
  let counter = 0;
  const cleaned = md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const id = `__MERMAID_${counter++}__`;
    blocks.set(id, code.trim());
    return `<div data-mermaid-id="${id}"></div>`;
  });
  return { cleaned, blocks };
}

export function Preview({ markdown: md, theme = "default" }: PreviewProps) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { cleaned, blocks: mermaidBlocks } = useMemo(() => extractMermaidBlocks(md), [md]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      const result = await renderMarkdown(cleaned);
      setHtml(result);
    }, 300);

    return () => clearTimeout(timerRef.current);
  }, [cleaned]);

  return (
    <div ref={containerRef} className="h-full overflow-auto p-8">
      <div className={`prose prose-neutral max-w-none ${getThemeClassName(theme)}`}>
        {html.split(/(<div data-mermaid-id="__MERMAID_\d+__"><\/div>)/).map((part, i) => {
          const match = part.match(/data-mermaid-id="(__MERMAID_\d+__)"/);
          if (match && mermaidBlocks.has(match[1])) {
            return <MermaidRenderer key={match[1]} chart={mermaidBlocks.get(match[1])!} />;
          }
          return <div key={i} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </div>
    </div>
  );
}
