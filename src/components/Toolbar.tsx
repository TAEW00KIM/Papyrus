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
  { id: "custom", label: "Custom CSS" },
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

  const btnBase =
    "px-4 py-[7px] text-[13px] font-medium rounded-[10px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] select-none";
  const btnGhost =
    "text-gray-500 hover:text-gray-900 hover:bg-gray-100/80";
  const btnSolid =
    "text-white bg-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:bg-gray-800 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]";

  return (
    <header className="flex items-center justify-between h-[52px] px-5 bg-white/90 backdrop-blur-xl border-b border-black/[0.04] sticky top-0 z-40">
      <div className="flex items-center gap-2.5">
        <h1 className="text-[15px] font-bold tracking-[-0.02em] text-gray-900">
          Papyrus
        </h1>
        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100/80 px-1.5 py-[1px] rounded-[5px] uppercase tracking-wide">
          beta
        </span>
      </div>

      <nav className="flex items-center gap-1.5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`${btnBase} ${btnGhost}`}
        >
          업로드
        </button>

        <div className="w-px h-4 bg-gray-200/60 mx-1" />

        <select
          value={currentTheme}
          onChange={(e) => onThemeChange(e.target.value)}
          className={`${btnBase} ${btnGhost} appearance-none cursor-pointer pr-7
            bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2210%22%20height%3D%2210%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
            bg-[position:right_8px_center] bg-no-repeat`}
        >
          {THEMES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>

        <button
          onClick={onTocToggle}
          className={`${btnBase} ${tocEnabled ? btnSolid : btnGhost}`}
        >
          목차
        </button>

        <div className="w-px h-4 bg-gray-200/60 mx-1" />

        <button
          onClick={onExportPdf}
          className={`${btnBase} ${btnSolid} px-5 font-semibold`}
        >
          PDF 내보내기
        </button>
      </nav>
    </header>
  );
}
