import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-light"],
      langs: ["javascript", "typescript", "python", "java", "go", "rust", "bash", "json", "html", "css", "sql", "yaml", "markdown"],
    });
  }
  return highlighter;
}
