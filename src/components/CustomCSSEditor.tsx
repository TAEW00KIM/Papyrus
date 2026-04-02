"use client";

import { useState, useEffect } from "react";

interface CustomCSSEditorProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (css: string) => void;
}

const PLACEHOLDER = `/* 커스텀 테마 CSS */
/* .theme-custom 클래스 안에서 스타일을 정의하세요 */

.theme-custom {
  font-family: 'Pretendard', sans-serif;
  font-size: 15px;
  line-height: 1.75;
  color: #222;
}

.theme-custom h1 {
  font-size: 1.8em;
  font-weight: 700;
}

.theme-custom h2 {
  font-size: 1.4em;
  font-weight: 700;
}

.theme-custom code {
  font-family: 'JetBrains Mono', monospace;
  background: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}`;

const STORAGE_KEY = "papyrus-custom-css";

export function CustomCSSEditor({ open, onClose, value, onChange }: CustomCSSEditorProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value, open]);

  if (!open) return null;

  const handleApply = () => {
    onChange(draft);
    localStorage.setItem(STORAGE_KEY, draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-xl w-[560px] max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.04]">
          <h2 className="text-[15px] font-bold text-gray-900">커스텀 테마 CSS</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>
        <div className="flex-1 min-h-0 p-4">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            className="w-full h-[400px] p-4 font-mono text-[13px] leading-relaxed text-gray-800
              bg-gray-50 border border-black/[0.06] rounded-xl resize-none
              focus:outline-none focus:ring-2 focus:ring-gray-900/10
              placeholder:text-gray-300"
          />
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-black/[0.04]">
          <button
            onClick={onClose}
            className="px-4 py-[7px] text-[13px] font-medium text-gray-500 rounded-[10px]
              hover:bg-gray-100 active:scale-[0.97]
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            취소
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-[7px] text-[13px] font-semibold text-white bg-gray-900 rounded-[10px]
              shadow-[0_1px_2px_rgba(0,0,0,0.1)]
              hover:bg-gray-800 active:scale-[0.97]
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
