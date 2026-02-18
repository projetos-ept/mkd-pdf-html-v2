
import React, { useEffect, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import mermaid from 'mermaid';
import { DocumentState, TocItem } from '../types';
import { THEMES, FONTS } from '../constants';
import { ListTree, X } from 'lucide-react';

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
      fontFamily: 'Inter',
    });
  }, [state.theme]);

  useEffect(() => {
    const renderContent = async () => {
      if (containerRef.current) {
        // TOC extraction
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

        // Render Mermaid Diagrams
        try {
          // Fix: Explicitly specify HTMLElement type for querySelectorAll to match mermaid.run's expected nodes type (ArrayLike<HTMLElement>)
          const mermaidDivs = containerRef.current.querySelectorAll<HTMLElement>('.language-mermaid');
          if (mermaidDivs.length > 0) {
            // Give it a tiny delay to ensure DOM is ready
            setTimeout(async () => {
              await mermaid.run({
                nodes: mermaidDivs,
              });
            }, 10);
          }
        } catch (err) {
          console.warn('Mermaid render issue:', err);
        }
      }
    };

    renderContent();
  }, [state.markdown, state.theme]);

  const notebookStyle = state.theme === 'NOTEBOOK' ? {
    backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px)`,
    backgroundSize: `100% 1.5rem`,
    position: 'relative' as const,
    paddingLeft: '60px',
  } : {};

  return (
    <div className="relative h-full flex flex-col overflow-hidden bg-gray-50">
      {/* TOC Toggle */}
      {state.showTOC && (
        <button
          onClick={() => setIsTocOpen(!isTocOpen)}
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 backdrop-blur border border-gray-200 rounded-full shadow-lg hover:bg-white transition-all transform active:scale-95 no-print"
          title="Sumário"
        >
          <ListTree size={20} className="text-gray-700" />
        </button>
      )}

      {/* TOC Panel */}
      {isTocOpen && state.showTOC && (
        <div className="absolute top-0 right-0 h-full w-72 bg-white border-l border-gray-200 shadow-2xl z-30 flex flex-col no-print animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-sm">Sumário Estrutural</h3>
            <button 
              onClick={() => setIsTocOpen(false)}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {toc.length > 0 ? toc.map((item, idx) => (
              <div
                key={idx}
                className={`text-sm cursor-pointer hover:text-blue-600 transition-colors py-1 border-l-2 pl-2 ${
                  item.level === 1 ? 'font-bold border-blue-500' : 
                  item.level === 2 ? 'ml-2 border-gray-300' : 'ml-4 border-gray-100 text-gray-500'
                }`}
              >
                {item.text}
              </div>
            )) : <p className="text-gray-400 text-xs italic">Nenhum título encontrado (H1-H3).</p>}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div 
        className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16 print:p-0 transition-colors duration-500"
        style={{ 
          backgroundColor: theme.bg, 
          color: theme.text,
          ...FONTS[state.fontFamily as keyof typeof FONTS] 
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          {state.header && (
            <div 
              className={`pb-6 mb-10 border-b border-gray-200/50 text-sm italic opacity-70 ${state.headerMode === 'fixed' ? 'sticky top-0 bg-inherit z-10' : ''}`}
              dangerouslySetInnerHTML={{ __html: md.render(state.header) }}
            />
          )}

          {/* Main Content */}
          <div 
            ref={containerRef}
            className="prose prose-slate max-w-none preview-content"
            style={{ 
              fontSize: `${state.fontSize}px`,
              lineHeight: '1.7',
              ...notebookStyle
            }}
          >
            {/* Red Line for Notebook */}
            {state.theme === 'NOTEBOOK' && (
              <div 
                className="absolute top-0 left-[50px] bottom-0 w-[1px] bg-red-400/40 pointer-events-none no-print"
              />
            )}
          </div>

          {/* Footer */}
          {state.footer && (
            <div 
              className={`mt-16 pt-8 border-t border-gray-200/50 text-xs opacity-60 text-center ${state.footerMode === 'fixed' ? 'sticky bottom-0 bg-inherit z-10 py-4' : ''}`}
              dangerouslySetInnerHTML={{ __html: md.render(state.footer) }}
            />
          )}
        </div>
      </div>

      <style>{`
        .preview-content h1 { color: ${theme.accent}; font-weight: 800; font-size: 2.25em; margin-bottom: 1em; letter-spacing: -0.02em; }
        .preview-content h2 { color: ${theme.accent}; font-weight: 700; font-size: 1.6em; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 0.3em; margin-top: 2em; }
        .preview-content h3 { color: ${theme.accent}; font-weight: 600; font-size: 1.3em; margin-top: 1.5em; }
        .preview-content blockquote { border-left: 4px solid ${theme.accent}; padding: 0.5rem 1rem; font-style: italic; background: rgba(0,0,0,0.02); color: #4b5563; border-radius: 0 4px 4px 0; }
        .preview-content table { border-collapse: collapse; width: 100%; margin: 2rem 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .preview-content th, .preview-content td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
        .preview-content th { background-color: rgba(0,0,0,0.03); font-weight: 700; }
        .preview-content pre { background-color: #1e293b; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; border: 1px solid #334155; color: #e2e8f0; }
        .preview-content code { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: rgba(0,0,0,0.05); padding: 0.2em 0.4em; border-radius: 4px; }
        .preview-content pre code { background: transparent; padding: 0; }
        .preview-content img { max-width: 100%; border-radius: 0.75rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .preview-content p { margin-bottom: 1.25rem; }
        .preview-content a { color: ${theme.accent}; text-decoration: underline; text-underline-offset: 2px; }
        
        @media print {
            .preview-content { padding-left: 0 !important; background-image: none !important; }
            .preview-content::before { display: none; }
            .preview-content h1, .preview-content h2 { break-after: avoid; }
            .preview-content pre, .preview-content table, .preview-content blockquote { break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default Preview;
