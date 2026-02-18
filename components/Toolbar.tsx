
import React from 'react';
import { Bold, Italic, Link, List, Table, Image, Code, FileCode } from 'lucide-react';

interface ToolbarProps {
  onInsert: (text: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onInsert }) => {
  const tools = [
    { icon: <Bold size={18} />, label: 'B', snippet: '**Texto em Negrito**', title: 'Negrito' },
    { icon: <Italic size={18} />, label: 'I', snippet: '_Texto em Itálico_', title: 'Itálico' },
    { icon: <Link size={18} />, label: 'Link', snippet: '[Descrição](https://)', title: 'Link' },
    { icon: <List size={18} />, label: 'Lista', snippet: '\n- Item 1\n- Item 2', title: 'Lista' },
    { icon: <Table size={18} />, label: 'Tabela', snippet: '\n| Cabeçalho | Info |\n| :--- | :--- |\n| Item | Valor |', title: 'Tabela' },
    { icon: <Image size={18} />, label: 'Img', snippet: '![Legenda](https://picsum.photos/400/200)', title: 'Imagem' },
    { icon: <Code size={18} />, label: 'Code', snippet: '`código`', title: 'Código inline' },
    { icon: <FileCode size={18} />, label: 'Mermaid', snippet: '\n```mermaid\ngraph TD\n    A[Início] --> B[Fim]\n```', title: 'Diagrama Mermaid' },
  ];

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50 border-b overflow-x-auto">
      {tools.map((tool, idx) => (
        <button
          key={idx}
          onClick={() => onInsert(tool.snippet)}
          className="p-2 hover:bg-gray-200 rounded text-gray-700 flex items-center gap-1 transition-colors"
          title={tool.title}
        >
          {tool.icon}
          <span className="text-xs font-bold hidden sm:inline">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
