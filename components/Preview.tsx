
import React, { useEffect, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { DocumentState, TocItem } from '../types';
import { THEMES, FONTS } from '../constants';
import { ListTree, X } from 'lucide-react';

// Initialize Markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

interface PreviewProps {
  state: DocumentState;
}

const Preview: React.FC<PreviewProps> = ({ state }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [isTocOpen, setIsTocOpen] = useState(false);

  const theme = THEMES.find((t) => t.id === state.theme) || THEMES[0];

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: state.theme === 'MODERN' ? 'default' : state.theme === 'SEPIA' ? 'neutral' : 'forest',
      securityLevel: 'loose',
    });
  }, [state.theme]);

  useEffect(() => {
    const renderContent = async () => {
      if (containerRef.current) {
        // Simple manual TOC extraction
        const headings: TocItem[] = [];
        const lines = state.markdown.split('\n');
        lines.forEach((line, index) => {
          const match = line.match(/^(#{1,3})\s+(.+)$/);
          if (match) {
            headings.push({
              id: `heading-${index}`,
              level: match[1].length,
              text: match[2].trim(),
            });
          }
        });
        setToc(headings);

        // Render Markdown
        containerRef.current.innerHTML = md.render(state.markdown);

        // Render Mermaid
        try {
          await mermaid.run({
            nodes: containerRef.current.querySelectorAll('.language-mermaid'),
          });
        } catch (err) {
          console.error('Mermaid render error:', err);
        }
      }
    };

    renderContent();
  }, [state.markdown]);

  const notebookStyle = state.theme === 'NOTEBOOK' ? {
    backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px)`,
    backgroundSize: `100% 1.5rem`,
    position: 'relative' as const,
    paddingLeft: '60px',
  } : {};

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* TOC Toggle */}
      {state.showTOC && (
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur border rounded-full shadow-md hover:bg-white transition-colors no-print"
          title="Sumário"
        >
          <ListTree size={20} className="text-gray-700" />
        </button>
      )}

      {/* TOC Panel */}
      {isTocOpen && state.showTOC && (
        <div className="absolute top-0 right-0 h-full w-64 bg-white border-l shadow-xl z-30 flex flex-col no-print">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-bold text-gray-700">Sumário</h3>
            <button onClick={() => setIsTocOpen(false)}><X size={18} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {toc.length > 0 ? toc.map((item, idx) => (
              <div
                key={idx}
                className={`text-sm cursor-pointer hover:text-blue-600 transition-colors ${
                  item.level === 1 ? 'font-bold' : item.level === 2 ? 'pl-2' : 'pl-4'
                }`}
              >
                {item.text}
              </div>
            )) : <p className="text-gray-400 text-xs">Nenhum título H1-H3 encontrado.</p>}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div 
        className="flex-1 overflow-y-auto p-8 md:p-12 print:p-0"
        style={{ 
          backgroundColor: theme.bg, 
          color: theme.text,
          ...FONTS[state.fontFamily as keyof typeof FONTS] 
        }}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          {state.header && (
            <div 
              className={`pb-4 border-b border-gray-200 text-sm opacity-70 ${state.headerMode === 'fixed' ? 'sticky top-0 bg-inherit z-10' : ''}`}
              dangerouslySetInnerHTML={{ __html: md.render(state.header) }}
            />
          )}

          {/* Main Markdown Content */}
          <div 
            ref={containerRef}
            className={`prose prose-slate max-w-none preview-content`}
            style={{ 
              fontSize: `${state.fontSize}px`,
              lineHeight: '1.6',
              ...notebookStyle
            }}
          >
            {/* Mermaid vertical line for notebook theme */}
            {state.theme === 'NOTEBOOK' && (
              <div 
                className="absolute top-0 left-[50px] bottom-0 w-[2px] bg-red-300 pointer-events-none no-print"
              />
            )}
          </div>

          {/* Footer */}
          {state.footer && (
            <div 
              className={`pt-8 border-t border-gray-200 text-xs opacity-60 text-center ${state.footerMode === 'fixed' ? 'sticky bottom-0 bg-inherit z-10' : ''}`}
              dangerouslySetInnerHTML={{ __html: md.render(state.footer) }}
            />
          )}
        </div>
      </div>

      <style>{`
        .preview-content h1 { color: ${theme.accent}; font-weight: 800; font-size: 2em; margin-top: 0; }
        .preview-content h2 { color: ${theme.accent}; font-weight: 700; font-size: 1.5em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
        .preview-content h3 { color: ${theme.accent}; font-weight: 600; font-size: 1.25em; }
        .preview-content blockquote { border-left: 4px solid ${theme.accent}; padding-left: 1rem; font-style: italic; color: #4b5563; }
        .preview-content table { border-collapse: collapse; width: 100%; }
        .preview-content th, .preview-content td { border: 1px solid #cbd5e1; padding: 0.5rem; text-align: left; }
        .preview-content th { background-color: rgba(0,0,0,0.05); }
        .preview-content pre { background-color: #f8fafc; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; border: 1px solid #e2e8f0; color: #1e293b; }
        .preview-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.9em; }
        .preview-content img { max-width: 100%; border-radius: 0.5rem; }
        .preview-content p { margin-bottom: 1rem; }
        .preview-content a { color: ${theme.accent}; text-decoration: underline; }
        
        @media print {
            .preview-content { padding-left: 0 !important; background-image: none !important; }
            .preview-content::before { display: none; }
        }
      `}</style>
    </div>
  );
};

export default Preview;
