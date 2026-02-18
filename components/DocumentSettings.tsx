
import React from 'react';
import { DocumentState, FontId, HeaderFooterMode } from '../types';
import { TEMPLATES } from '../constants';
import { Settings, Type, Layout, FileText, ChevronDown } from 'lucide-react';

interface DocumentSettingsProps {
  state: DocumentState;
  updateState: (updates: Partial<DocumentState>) => void;
}

const DocumentSettings: React.FC<DocumentSettingsProps> = ({ state, updateState }) => {
  return (
    <div className="p-4 bg-gray-50 border-t space-y-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
        <Settings size={14} /> Configurações do Documento
      </h3>

      {/* Font Settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Type size={16} /> Fonte & Tamanho
          </label>
        </div>
        <div className="flex gap-2">
          {(['sans', 'serif', 'mono'] as FontId[]).map(f => (
            <button
              key={f}
              onClick={() => updateState({ fontFamily: f })}
              className={`px-3 py-1.5 rounded border text-xs capitalize ${state.fontFamily === f ? 'bg-white border-blue-500 text-blue-600 font-bold' : 'bg-gray-100 border-gray-200'}`}
            >
              {f}
            </button>
          ))}
          <input 
            type="number" 
            value={state.fontSize} 
            onChange={(e) => updateState({ fontSize: Number(e.target.value) })}
            className="w-16 px-2 py-1.5 text-xs border rounded bg-white text-center"
            min="10" max="48"
          />
          <span className="text-xs text-gray-400 self-center">px</span>
        </div>
      </div>

      {/* Templates */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText size={16} /> Modelos Prontos
        </label>
        <select 
          onChange={(e) => {
            const t = TEMPLATES.find(tmp => tmp.id === e.target.value);
            if (t) updateState({ markdown: t.markdown, header: t.header, footer: t.footer });
          }}
          className="w-full p-2 text-xs border rounded bg-white"
          defaultValue=""
        >
          <option value="" disabled>Selecione um template...</option>
          {TEMPLATES.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* Header/Footer Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Layout size={16} /> Cabeçalho & Rodapé
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-gray-500">Sumário</span>
            <input 
              type="checkbox" 
              checked={state.showTOC} 
              onChange={e => updateState({ showTOC: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 mb-1">
             <input 
              value={state.header}
              onChange={e => updateState({ header: e.target.value })}
              placeholder="Cabeçalho (Markdown)..."
              className="flex-1 p-2 text-xs border rounded bg-white"
            />
            <select 
              value={state.headerMode} 
              onChange={e => updateState({ headerMode: e.target.value as HeaderFooterMode })}
              className="p-2 text-[10px] border rounded bg-white"
            >
              <option value="normal">Normal</option>
              <option value="fixed">Fixo</option>
            </select>
          </div>
          <div className="flex gap-2">
             <input 
              value={state.footer}
              onChange={e => updateState({ footer: e.target.value })}
              placeholder="Rodapé (Markdown)..."
              className="flex-1 p-2 text-xs border rounded bg-white"
            />
             <select 
              value={state.footerMode} 
              onChange={e => updateState({ footerMode: e.target.value as HeaderFooterMode })}
              className="p-2 text-[10px] border rounded bg-white"
            >
              <option value="normal">Normal</option>
              <option value="fixed">Fixo</option>
            </select>
          </div>
          <p className="text-[10px] text-gray-400 italic">Dica: Use {`{page}`} no rodapé para numeração automática na impressão.</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentSettings;
