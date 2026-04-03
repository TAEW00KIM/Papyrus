interface PdfOptions {
  title?: string;
  themeCSS?: string;
  tocHtml?: string;
}

export function exportPdf(html: string, options: PdfOptions = {}) {
  const { title = "Papyrus Document", themeCSS = "" } = options;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap">
      <style>
        @page {
          size: A4;
          margin: 25mm 20mm 25mm 20mm;
        }

        * { box-sizing: border-box; }

        body {
          font-family: 'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 10.5pt;
          line-height: 1.8;
          color: #2c3e50;
          padding: 0;
          margin: 0;
          -webkit-font-smoothing: antialiased;
          word-break: keep-all;
          overflow-wrap: break-word;
        }

        .content {
          max-width: 100%;
        }

        /* ── Headings ── */
        h1, h2, h3, h4, h5, h6 {
          color: #1a1a1a;
          font-weight: 700;
          break-after: avoid;
          orphans: 3;
          widows: 3;
        }

        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {
          text-decoration: none;
          color: inherit;
          border-bottom: none;
        }

        h1 {
          font-size: 1.8em;
          margin: 0 0 0.8em 0;
          letter-spacing: -0.02em;
          line-height: 1.4;
        }

        h2 {
          font-size: 1.4em;
          margin: 2em 0 0.6em 0;
          letter-spacing: -0.01em;
          line-height: 1.45;
        }

        h3 {
          font-size: 1.15em;
          margin: 1.8em 0 0.5em 0;
          line-height: 1.5;
        }

        h4 { font-size: 1.05em; margin: 1.5em 0 0.4em 0; }
        h5 { font-size: 1em; margin: 1.4em 0 0.4em 0; color: #555; }
        h6 { font-size: 0.95em; margin: 1.4em 0 0.4em 0; color: #777; }

        /* ── Paragraphs ── */
        p {
          margin: 0 0 0.85em 0;
          line-height: 1.8;
        }

        /* ── Links ── */
        a {
          color: #2c3e50;
          text-decoration: none;
        }

        /* ── Strong / Emphasis ── */
        strong { font-weight: 700; color: #1a1a1a; }
        em { font-style: italic; }

        /* ── Blockquote ── */
        blockquote {
          margin: 1.2em 0;
          padding: 0.6em 1.2em;
          border-left: 3px solid #d0d7de;
          background: #f8f9fa;
          color: #4a5568;
          border-radius: 0 6px 6px 0;
          break-inside: avoid;
        }

        blockquote p { margin-bottom: 0.4em; }
        blockquote p:last-child { margin-bottom: 0; }
        blockquote blockquote { margin: 0.5em 0; }

        /* ── Lists ── */
        ul, ol {
          margin: 0.6em 0 1em 0;
          padding-left: 1.6em;
        }

        li {
          margin-bottom: 0.3em;
          line-height: 1.75;
        }

        li > ul, li > ol {
          margin: 0.2em 0 0.2em 0;
        }

        li > p { margin-bottom: 0.3em; }

        /* Checkbox lists */
        li input[type="checkbox"] {
          margin-right: 0.4em;
          vertical-align: middle;
        }

        /* ── Code ── */
        code {
          font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, monospace;
          font-size: 0.85em;
          background: #f3f4f6;
          padding: 0.15em 0.4em;
          border-radius: 4px;
          color: #e83e8c;
          word-break: break-word;
        }

        pre {
          margin: 1em 0 1.2em 0;
          padding: 1em 1.2em;
          background: #f6f8fa;
          border: 1px solid #e8ecf0;
          border-radius: 8px;
          overflow-x: auto;
          line-height: 1.6;
          break-inside: avoid;
        }

        pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          color: inherit;
          font-size: 0.82em;
          word-break: normal;
        }

        .shiki-wrapper pre {
          border: 1px solid #e8ecf0;
          border-radius: 8px;
          padding: 1em 1.2em;
        }

        /* ── Tables ── */
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0 1.4em 0;
          font-size: 0.92em;
          break-inside: avoid;
        }

        thead { break-after: avoid; }

        th, td {
          border: 1px solid #e2e6ea;
          padding: 0.55em 0.9em;
          text-align: left;
          line-height: 1.6;
        }

        th {
          background: #f6f8fa;
          font-weight: 600;
          color: #1a1a1a;
        }

        tr:nth-child(even) td {
          background: #fafbfc;
        }

        /* ── Images ── */
        img {
          max-width: 100%;
          border-radius: 6px;
          break-inside: avoid;
          margin: 0.5em 0;
        }

        figure {
          margin: 1.2em 0;
          text-align: center;
          break-inside: avoid;
        }

        figcaption {
          font-size: 0.88em;
          color: #6b7280;
          margin-top: 0.5em;
        }

        /* ── Horizontal Rule ── */
        hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, #d0d7de 20%, #d0d7de 80%, transparent);
          margin: 2em 0;
        }

        /* ── KaTeX ── */
        .katex-display {
          margin: 1em 0;
          break-inside: avoid;
        }

        /* ── Page break hints ── */
        h1 { break-before: auto; }
        h2 { break-before: auto; }
        pre, table, figure, img, blockquote, .katex-display {
          break-inside: avoid;
        }
        h1 + *, h2 + *, h3 + * {
          break-before: avoid;
        }

        /* ── Print cleanup ── */
        @media print {
          body { color: #2c3e50; }
        }
      </style>
      <style>${themeCSS}</style>
    </head>
    <body>
      <div class="content">${options.tocHtml || ""}${html}</div>
    </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow!.onafterprint = () => {
    document.body.removeChild(iframe);
  };

  setTimeout(() => {
    iframe.contentWindow!.print();
    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }, 1000);
  }, 500);
}
