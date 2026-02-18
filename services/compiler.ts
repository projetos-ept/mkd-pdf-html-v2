
import MarkdownIt from 'markdown-it';
import { DocumentState, ThemeId } from '../types';
import { THEMES, FONTS } from '../constants';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

export const compileToStandaloneHTML = (state: DocumentState): string => {
  const theme = THEMES.find(t => t.id === state.theme) || THEMES[0];
  const renderedContent = md.render(state.markdown);
  const renderedHeader = md.render(state.header);
  const renderedFooter = md.render(state.footer);

  const fontStack = state.fontFamily === 'serif' ? '"Lora", serif' : 
                   state.fontFamily === 'mono' ? '"JetBrains Mono", monospace' : 
                   '"Inter", sans-serif';

  const notebookStyles = state.theme === 'NOTEBOOK' ? `
    .content-wrapper {
      background-image: linear-gradient(#e5e7eb 1px, transparent 1px);
      background-size: 100% 1.5rem;
      position: relative;
      padding-left: 60px !important;
    }
    .content-wrapper::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50px;
      bottom: 0;
      width: 2px;
      background-color: #fca5a5;
    }
  ` : '';

  return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Exported Document - StaticMD</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lora:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            padding: 40px;
            background-color: ${theme.bg};
            color: ${theme.text};
            font-family: ${fontStack};
            font-size: ${state.fontSize}px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header { 
          border-bottom: 1px solid #ddd; 
          margin-bottom: 2rem; 
          font-size: 0.9em;
          color: #666;
        }
        footer { 
          border-top: 1px solid #ddd; 
          margin-top: 4rem; 
          padding-top: 1rem;
          font-size: 0.8em;
          color: #666;
        }
        h1, h2, h3 { color: ${theme.accent}; margin-top: 1.5em; }
        pre { background: #f3f4f6; padding: 1rem; border-radius: 4px; overflow-x: auto; color: #1f2937; }
        code { font-family: "JetBrains Mono", monospace; font-size: 0.9em; }
        table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f9fafb; }
        blockquote { border-left: 4px solid ${theme.accent}; padding-left: 1rem; font-style: italic; color: #4b5563; }
        img { max-width: 100%; height: auto; border-radius: 4px; }
        
        ${notebookStyles}

        @media print {
            body { padding: 0; }
            .container { max-width: 100%; }
            ${state.headerMode === 'fixed' ? 'header { position: fixed; top: 0; width: 100%; }' : ''}
            ${state.footerMode === 'fixed' ? 'footer { position: fixed; bottom: 0; width: 100%; }' : ''}
        }
    </style>
</head>
<body>
    <div class="container">
        ${state.header ? `<header>${renderedHeader}</header>` : ''}
        <div class="content-wrapper">
          ${renderedContent}
        </div>
        ${state.footer ? `<footer>${renderedFooter}</footer>` : ''}
    </div>
    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
    </script>
</body>
</html>
  `;
};
