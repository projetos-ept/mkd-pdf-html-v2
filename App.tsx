
import React, { useState, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ThemeSelector from './components/ThemeSelector';
import DocumentSettings from './components/DocumentSettings';
import { DocumentState, ThemeId } from './types';
import { Download, Printer, Plus, FileUp, Save, RefreshCw } from 'lucide-react';
import { compileToStandaloneHTML } from './services/compiler';
import { TEMPLATES } from './constants';

const STORAGE_KEY = 'staticmd_save_data';

const initialState: DocumentState = {
  markdown: TEMPLATES[1].markdown, // Default Bioq template
  header: TEMPLATES[1].header,
  footer: TEMPLATES[1].footer,
  headerMode: 'normal',
  footerMode: 'normal',
  theme: 'MODERN',
  fontFamily: 'sans',
  fontSize: 16,
  showTOC: true,
};

function App() {
  const [state, setState] = useState<DocumentState>(initialState);
  const [isSaving, setIsSaving] = useState(false);

  // Persistence: Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading saved data", e);
      }
    }
  }, []);

  // Persistence: Auto-save to LocalStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setTimeout(() => setIsSaving(false), 500);
    }, 1000);
    return () => clearTimeout(timer);
  }, [state]);

  const updateState = useCallback((updates: Partial<DocumentState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleDownloadHTML = () => {
    const html = compileToStandaloneHTML(state);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento-staticmd.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNew = () => {
    if (window.confirm("Isso apagará seu trabalho atual. Deseja continuar?")) {
      setState(initialState);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      updateState({ markdown: content });
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden font-sans">
      {/* Header Toolbar */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-50 shadow-sm no-print">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <RefreshCw size={18} className={isSaving ? "animate-spin" : ""} />
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent hidden sm:block">
            StaticMD
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleNew}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
          >
            <Plus size={16} /> <span className="hidden md:inline">Novo Doc</span>
          </button>
          
          <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer">
            <FileUp size={16} /> <span className="hidden md:inline">Importar .md</span>
            <input type="file" accept=".md,.txt" className="hidden" onChange={handleImport} />
          </label>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <button 
            onClick={handleDownloadHTML}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm transition-all"
          >
            <Download size={16} /> <span className="hidden md:inline">Baixar HTML</span>
          </button>

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded border transition-all"
          >
            <Printer size={16} /> <span className="hidden md:inline">Imprimir / PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor & Settings */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col h-full overflow-hidden border-r bg-white no-print">
          <div className="flex-1 overflow-hidden">
            <Editor 
              value={state.markdown} 
              onChange={(val) => updateState({ markdown: val })} 
            />
          </div>
          <div className="h-1/3 min-h-[300px] overflow-y-auto border-t">
            <ThemeSelector 
              currentTheme={state.theme} 
              onSelect={(themeId) => updateState({ theme: themeId })} 
            />
            <DocumentSettings 
              state={state} 
              updateState={updateState} 
            />
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="hidden md:block md:flex-1 h-full bg-gray-50 print:block print:w-full">
          <Preview state={state} />
        </div>
      </main>

      {/* Footer Status */}
      <footer className="h-8 bg-gray-50 border-t flex items-center justify-between px-4 text-[10px] text-gray-400 no-print">
        <div className="flex items-center gap-4">
          <span>{state.markdown.length} caracteres</span>
          <span>{state.markdown.split(/\s+/).length} palavras</span>
        </div>
        <div className="flex items-center gap-2">
          {isSaving ? (
             <span className="flex items-center gap-1"><Save size={10} /> Salvando...</span>
          ) : (
             <span className="flex items-center gap-1"><Save size={10} className="text-green-500" /> Sincronizado</span>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
