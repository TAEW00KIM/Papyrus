"use client";

import { useCodeMirror } from "@/hooks/useCodeMirror";

interface EditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

export function Editor({ initialValue, onChange }: EditorProps) {
  const { containerRef } = useCodeMirror({ initialValue, onChange });

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto border-r border-gray-200"
    />
  );
}
