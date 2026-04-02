"use client";

import { useState } from "react";
import { Editor } from "@/components/Editor";

const INITIAL_MD = `# Hello Papyrus

This is a **markdown** editor.

- Item 1
- Item 2
`;

export default function Home() {
  const [md, setMd] = useState(INITIAL_MD);

  return (
    <main className="h-screen flex flex-col">
      <div className="flex-1">
        <Editor initialValue={INITIAL_MD} onChange={setMd} />
      </div>
    </main>
  );
}
