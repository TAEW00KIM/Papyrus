"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Preview } from "@/components/Preview";

declare global {
  interface Window {
    showOpenFilePicker(options?: {
      types?: { description: string; accept: Record<string, string[]> }[];
    }): Promise<FileSystemFileHandle[]>;
  }
  interface FileSystemFileHandle {
    requestPermission(options?: { mode: string }): Promise<string>;
  }
}

const DB_NAME = "papyrus-view";
const STORE_NAME = "file-handle";
const KEY = "last";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveHandle(handle: FileSystemFileHandle) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(handle, KEY);
  db.close();
}

async function loadHandle(): Promise<FileSystemFileHandle | null> {
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(KEY);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => resolve(null);
    db.close();
  });
}

async function clearHandle() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(KEY);
  db.close();
}

export default function ViewPage() {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [watching, setWatching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);
  const [theme, setTheme] = useState("default");
  const [restoring, setRestoring] = useState(true);
  const handleRef = useRef<FileSystemFileHandle | null>(null);
  const lastModifiedRef = useRef(0);
  const errorCountRef = useRef(0);

  // Check browser support + restore saved handle
  useEffect(() => {
    if (typeof window.showOpenFilePicker !== "function") {
      setSupported(false);
      setRestoring(false);
      return;
    }

    (async () => {
      try {
        const saved = await loadHandle();
        if (saved) {
          const perm = await saved.requestPermission({ mode: "read" });
          if (perm === "granted") {
            handleRef.current = saved;
            errorCountRef.current = 0;
            setFileName(saved.name);
            const file = await saved.getFile();
            lastModifiedRef.current = file.lastModified;
            setMarkdown(await file.text());
            setWatching(true);
          }
        }
      } catch {
        // permission denied or handle invalid
      }
      setRestoring(false);
    })();
  }, []);

  const startWatching = useCallback(async (fileHandle: FileSystemFileHandle) => {
    handleRef.current = fileHandle;
    errorCountRef.current = 0;
    setFileName(fileHandle.name);
    setError(null);
    await saveHandle(fileHandle);

    const file = await fileHandle.getFile();
    lastModifiedRef.current = file.lastModified;
    setMarkdown(await file.text());
    setWatching(true);
  }, []);

  const handlePickFile = useCallback(async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Markdown",
            accept: { "text/markdown": [".md", ".markdown", ".txt"] },
          },
        ],
      });
      await startWatching(fileHandle);
    } catch {
      // user cancelled picker
    }
  }, [startWatching]);

  const handleStop = useCallback(() => {
    setWatching(false);
    setMarkdown(null);
    setError(null);
    handleRef.current = null;
    lastModifiedRef.current = 0;
    errorCountRef.current = 0;
    clearHandle();
  }, []);

  // Poll file for changes (setTimeout chain to avoid race conditions)
  useEffect(() => {
    if (!watching || !handleRef.current) return;

    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      const handle = handleRef.current;
      if (!handle) return;

      try {
        const file = await handle.getFile();
        if (file.lastModified !== lastModifiedRef.current) {
          lastModifiedRef.current = file.lastModified;
          setMarkdown(await file.text());
        }
        errorCountRef.current = 0;
      } catch {
        errorCountRef.current++;
        if (errorCountRef.current >= 10) {
          setError("파일에 접근할 수 없습니다. 파일이 삭제되었거나 이동되었을 수 있습니다.");
          setWatching(false);
          setMarkdown(null);
          clearHandle();
          return;
        }
      }

      if (!cancelled) setTimeout(poll, 500);
    }

    poll();
    return () => { cancelled = true; };
  }, [watching]);

  // Loading state while restoring
  if (restoring) {
    return (
      <main className="h-screen flex items-center justify-center bg-white">
        <p className="text-[13px] text-gray-300">불러오는 중...</p>
      </main>
    );
  }

  // File picker phase
  if (!watching && markdown === null) {
    return (
      <main className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-8 w-full max-w-[480px] px-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[18px] font-bold tracking-[-0.02em] text-gray-900">
              실시간 미리보기
            </h1>
          </div>

          <p className="text-[13px] text-gray-400 text-center leading-relaxed">
            마크다운 파일을 선택하세요.
            <br />
            파일 수정 시 자동으로 미리보기가 갱신됩니다.
          </p>

          {!supported && (
            <p className="text-[13px] text-amber-600 bg-amber-50 px-4 py-2.5 rounded-xl w-full text-center">
              이 기능은 Chrome 또는 Edge 브라우저에서만 사용 가능합니다.
            </p>
          )}

          {error && (
            <p className="text-[13px] text-red-500 bg-red-50 px-4 py-2.5 rounded-xl w-full text-center">
              {error}
            </p>
          )}

          <button
            onClick={handlePickFile}
            disabled={!supported}
            className="w-full px-4 py-3 text-[14px] font-semibold rounded-xl text-white bg-gray-900
              shadow-[0_1px_2px_rgba(0,0,0,0.1)]
              hover:bg-gray-800 hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)]
              active:scale-[0.98]
              disabled:opacity-40 disabled:pointer-events-none
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            파일 선택
          </button>

          <Link
            href="/"
            className="text-[13px] text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            돌아가기
          </Link>
        </div>
      </main>
    );
  }

  // Preview phase
  return (
    <main className="h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between h-[44px] px-5 bg-white/90 backdrop-blur-xl border-b border-black/[0.04] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] text-gray-400 font-mono truncate max-w-[400px]">
              {fileName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-3 py-[5px] text-[12px] font-medium rounded-lg text-gray-500
              hover:text-gray-900 hover:bg-gray-100/80
              appearance-none cursor-pointer pr-6
              bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%228%22%20height%3D%228%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23aaa%22%20stroke-width%3D%222.5%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')]
              bg-[position:right_6px_center] bg-no-repeat
              transition-all duration-200"
          >
            <option value="default">Default</option>
            <option value="academic">Academic</option>
            <option value="minimal">Minimal</option>
          </select>

          <div className="w-px h-4 bg-gray-200/60 mx-1" />

          <button
            onClick={handleStop}
            className="px-3 py-[5px] text-[12px] font-medium rounded-lg text-gray-500
              hover:text-gray-900 hover:bg-gray-100/80
              active:scale-[0.97]
              transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
          >
            중지
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 bg-gray-50/50">
        {markdown !== null ? (
          <Preview markdown={markdown} theme={theme} />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-[13px] text-gray-300">불러오는 중...</p>
          </div>
        )}
      </div>
    </main>
  );
}
