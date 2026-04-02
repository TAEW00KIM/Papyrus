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
    <header className="flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h1 className="text-[17px] font-bold tracking-tight text-gray-900">
          Papyrus
        </h1>
        <span className="text-[11px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
          beta
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-50 rounded-xl
            hover:bg-gray-100 hover:text-gray-900
            active:scale-[0.97]
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          업로드
        </button>

        <div className="w-px h-5 bg-gray-150 mx-1" />

        <select
          value={currentTheme}
          onChange={(e) => onThemeChange(e.target.value)}
          className="px-4 py-2 text-[13px] font-medium text-gray-600 bg-gray-50 rounded-xl
            hover:bg-gray-100 hover:text-gray-900
            active:scale-[0.97]
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            appearance-none cursor-pointer pr-8
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
            bg-[position:right_10px_center] bg-no-repeat"
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={onTocToggle}
          className={`px-4 py-2 text-[13px] font-medium rounded-xl
            active:scale-[0.97]
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${tocEnabled
              ? "text-white bg-gray-900 shadow-sm"
              : "text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-900"
            }`}
        >
          목차
        </button>

        <div className="w-px h-5 bg-gray-150 mx-1" />

        <button
          onClick={onExportPdf}
          className="px-5 py-2 text-[13px] font-semibold text-white bg-gray-900 rounded-xl
            shadow-sm shadow-gray-900/10
            hover:bg-black hover:shadow-md hover:shadow-gray-900/15
            active:scale-[0.97]
            transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          PDF 내보내기
        </button>
      </div>
    </header>
  );
}
