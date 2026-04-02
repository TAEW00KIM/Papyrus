"use client";

import { useCodeMirror } from "@/hooks/useCodeMirror";

interface EditorProps {
  initialValue: string;
  onChange: (value: string) => void;
  onScroll?: (ratio: number) => void;
}

export function Editor({ initialValue, onChange, onScroll }: EditorProps) {
  const { containerRef } = useCodeMirror({ initialValue, onChange, onScroll });

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto border-r border-gray-200"
    />
  );
}
