import { describe, it, expect } from "vitest";
import { renderMarkdown } from "./markdown";

describe("renderMarkdown", () => {
  it("renders headings", async () => {
    const html = await renderMarkdown("# Hello");
    expect(html).toContain("<h1");
    expect(html).toContain("Hello");
  });

  it("renders GFM tables", async () => {
    const md = "| A | B |\n|---|---|\n| 1 | 2 |";
    const html = await renderMarkdown(md);
    expect(html).toContain("<table");
    expect(html).toContain("<td>1</td>");
  });

  it("renders math blocks", async () => {
    const html = await renderMarkdown("$$E = mc^2$$");
    expect(html).toContain("katex");
  });

  it("renders inline code", async () => {
    const html = await renderMarkdown("`const x = 1`");
    expect(html).toContain("<code");
  });

  it("renders checkboxes", async () => {
    const html = await renderMarkdown("- [x] done\n- [ ] todo");
    expect(html).toContain('type="checkbox"');
  });
});
