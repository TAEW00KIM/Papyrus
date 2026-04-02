"use client";

import { useRef } from "react";

interface ToolbarProps {
  onFileUpload: (content: string) => void;
  onExportPdf: () => void;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  tocEnabled: boolean;
  onTocToggle: () => void;
}

const THEMES = [
  { id: "default", label: "Default" },
  { id: "academic", label: "Academic" },
  { id: "minimal", label: "Minimal" },
];

export function Toolbar({
  onFileUpload,
  onExportPdf,
  currentTheme,
  onThemeChange,
  tocEnabled,
  onTocToggle,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onFileUpload(reader.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight text-black">
          Papyrus
        </span>
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        >
          파일 업로드
        </button>

        <select
          value={currentTheme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors appearance-none cursor-pointer"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={onTocToggle}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
            tocEnabled
              ? "text-white bg-black"
              : "text-gray-700 bg-gray-100 hover:bg-gray-200"
          }`}
        >
          목차
        </button>

        <button
          onClick={onExportPdf}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
        >
          PDF 내보내기
        </button>
      </div>
    </header>
  );
}
