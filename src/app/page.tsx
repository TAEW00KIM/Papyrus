"use client";

import { useState, useCallback, useEffect } from "react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Toolbar } from "@/components/Toolbar";
import { StatusBar } from "@/components/StatusBar";

const INITIAL_MD = `# Hello Papyrus

This is a **markdown** editor with live preview.

## Features

- GFM support (tables, checkboxes)
- Math: $E = mc^2$
- Code highlighting
- Mermaid diagrams

| Feature | Status |
|---------|--------|
| Editor  | Done   |
| Preview | Done   |

\`\`\`javascript
function hello() {
  console.log("Hello, Papyrus!");
}
\`\`\`
`;

export default function Home() {
  const [md, setMd] = useState(INITIAL_MD);
  const [theme, setTheme] = useState("default");
  const [fileLoadKey, setFileLoadKey] = useState(0);
  const [loadedContent, setLoadedContent] = useState(INITIAL_MD);
  const [scrollRatio, setScrollRatio] = useState(0);

  const handleFileUpload = useCallback((content: string) => {
    setMd(content);
    setLoadedContent(content);
    setFileLoadKey((k) => k + 1);
  }, []);

  const handleExportPdf = useCallback(async () => {
    const { exportPdf } = await import("@/lib/pdf");
    const { renderMarkdown } = await import("@/lib/markdown");
    const { getThemeClassName } = await import("@/lib/themes");
    const html = await renderMarkdown(md);
    const themeClass = getThemeClassName(theme);
    const res = await fetch(`/themes/${theme}.css`);
    const themeCSS = await res.text();
    exportPdf(`<div class="${themeClass}">${html}</div>`, { themeCSS });
  }, [md, theme]);

  return (
    <main className="h-screen flex flex-col bg-white">
      <Toolbar
        onFileUpload={handleFileUpload}
        onExportPdf={handleExportPdf}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 min-h-0">
          <Editor
            key={fileLoadKey}
            initialValue={loadedContent}
            onChange={setMd}
            onScroll={setScrollRatio}
          />
        </div>
        <div className="w-1/2 min-h-0 border-l border-gray-200">
          <Preview markdown={md} theme={theme} scrollRatio={scrollRatio} />
        </div>
      </div>
      <StatusBar markdown={md} />
    </main>
  );
}
