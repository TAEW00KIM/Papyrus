import type { Metadata } from "next";
import "./globals.css";
import "@/styles/themes/default.css";
import "@/styles/themes/academic.css";
import "@/styles/themes/minimal.css";

export const metadata: Metadata = {
  title: "Papyrus",
  description: "마크다운을 아름다운 PDF로",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className="h-full antialiased"
    >
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
