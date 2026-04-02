import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { getHighlighter } from "./shiki";
import type { Root, Element, Text } from "hast";
import { visit } from "unist-util-visit";

function rehypeShiki() {
  return async (tree: Root) => {
    const highlighter = await getHighlighter();
    const nodes: { node: Element; lang: string; code: string }[] = [];

    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "pre" &&
        node.children[0] &&
        (node.children[0] as Element).tagName === "code"
      ) {
        const codeNode = node.children[0] as Element;
        const className = (codeNode.properties?.className as string[]) || [];
        const lang = className
          .find((c) => c.startsWith("language-"))
          ?.replace("language-", "") || "text";
        const code = (codeNode.children[0] as Text)?.value || "";
        nodes.push({ node, lang, code });
      }
    });

    for (const { node, lang, code } of nodes) {
      try {
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: "github-light",
        });
        node.tagName = "div";
        node.properties = { className: ["shiki-wrapper"] };
        node.children = [{ type: "raw", value: html } as unknown as Element];
      } catch {
        // 지원하지 않는 언어는 기본 <pre> 유지
      }
    }
  };
}

export async function renderMarkdown(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeKatex)
    .use(rehypeShiki)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeStringify, { allowDangerousHtml: true, allowDangerousCharacters: true })
    .process(markdown);

  return String(result);
}
