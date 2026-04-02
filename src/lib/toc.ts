export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, "")
      .replace(/\s+/g, "-");
    items.push({ level, text, id });
  }

  return items;
}

export function renderTocHtml(items: TocItem[]): string {
  if (items.length === 0) return "";

  const minLevel = Math.min(...items.map((i) => i.level));

  const lines = items.map((item) => {
    const indent = "  ".repeat(item.level - minLevel);
    return `${indent}<li><a href="#${item.id}">${item.text}</a></li>`;
  });

  return `<nav class="toc"><h2>목차</h2><ul>${lines.join("\n")}</ul></nav>`;
}
