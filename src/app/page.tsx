"use client";

import { useState, useCallback, useEffect } from "react";
import { Editor } from "@/components/Editor";
import { Preview } from "@/components/Preview";
import { Toolbar } from "@/components/Toolbar";
import { StatusBar } from "@/components/StatusBar";
import { CustomCSSEditor } from "@/components/CustomCSSEditor";

const STORAGE_KEY = "papyrus-content";
const CUSTOM_CSS_KEY = "papyrus-custom-css";

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
  const [tocEnabled, setTocEnabled] = useState(false);
  const [customCSS, setCustomCSS] = useState("");
  const [cssEditorOpen, setCssEditorOpen] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setMd(saved);
      setLoadedContent(saved);
      setFileLoadKey((k) => k + 1);
    }
    const savedCSS = localStorage.getItem(CUSTOM_CSS_KEY);
    if (savedCSS) setCustomCSS(savedCSS);
  }, []);

  // Auto-save content
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, md);
    }, 1000);
    return () => clearTimeout(timer);
  }, [md]);

  // Inject custom CSS into <head> as a <style> tag
  useEffect(() => {
    const id = "papyrus-custom-theme";
    let el = document.getElementById(id) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = customCSS;
  }, [customCSS]);

  const handleFileUpload = useCallback((content: string) => {
    setMd(content);
    setLoadedContent(content);
    setFileLoadKey((k) => k + 1);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.name.match(/\.(md|markdown|txt)$/)) return;
    const reader = new FileReader();
    reader.onload = () => {
      handleFileUpload(reader.result as string);
    };
    reader.readAsText(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "custom") {
      setCssEditorOpen(true);
    }
  }, []);

  const handleExportPdf = useCallback(async () => {
    const { exportPdf } = await import("@/lib/pdf");
    const { renderMarkdown } = await import("@/lib/markdown");
    const { getThemeClassName } = await import("@/lib/themes");
    const { extractToc, renderTocHtml } = await import("@/lib/toc");
    const html = await renderMarkdown(md);
    const themeClass = getThemeClassName(theme);

    let themeCSS = "";
    if (theme === "custom") {
      themeCSS = customCSS;
    } else {
      try {
        const res = await fetch(`/themes/${theme}.css`);
        themeCSS = await res.text();
      } catch {
        // fallback: no theme CSS
      }
    }

    const tocHtml = tocEnabled ? renderTocHtml(extractToc(md)) : "";
    exportPdf(`<div class="${themeClass}">${html}</div>`, { themeCSS, tocHtml });
  }, [md, theme, tocEnabled, customCSS]);

  return (
    <main className="h-screen flex flex-col bg-white" onDrop={handleDrop} onDragOver={handleDragOver}>
      <Toolbar
        onFileUpload={handleFileUpload}
        onExportPdf={handleExportPdf}
        currentTheme={theme}
        onThemeChange={handleThemeChange}
        tocEnabled={tocEnabled}
        onTocToggle={() => setTocEnabled((v) => !v)}
      />
      <div className="flex-1 flex min-h-0">
        <div className="w-1/2 min-h-0 bg-white">
          <Editor
            key={fileLoadKey}
            initialValue={loadedContent}
            onChange={setMd}
            onScroll={setScrollRatio}
          />
        </div>
        <div className="w-px bg-black/[0.06] shrink-0" />
        <div className="w-1/2 min-h-0 bg-gray-50/50">
          <Preview markdown={md} theme={theme} scrollRatio={scrollRatio} />
        </div>
      </div>
      <StatusBar markdown={md} />
      <CustomCSSEditor
        open={cssEditorOpen}
        onClose={() => setCssEditorOpen(false)}
        value={customCSS}
        onChange={setCustomCSS}
      />
    </main>
  );
}
