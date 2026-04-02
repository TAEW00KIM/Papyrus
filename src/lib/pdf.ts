interface PdfOptions {
  title?: string;
  themeCSS?: string;
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
          margin: 2cm;
        }
        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.75;
          color: #222;
          padding: 0;
          margin: 0;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #111;
          break-after: avoid;
        }
        pre, code, table, figure, img {
          break-inside: avoid;
        }
        a { color: #000; text-decoration: underline; }
        img { max-width: 100%; }
        .shiki-wrapper pre {
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 1em;
        }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
        th { background-color: #f5f5f5; font-weight: 600; }
        .content { max-width: 100%; }
      </style>
      <style>${themeCSS}</style>
    </head>
    <body>
      <div class="content">${html}</div>
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
