
import { Theme, Template } from './types';

export const THEMES: Theme[] = [
  {
    id: 'MODERN',
    name: 'Modern Clean',
    bg: '#ffffff',
    text: '#1f2937',
    accent: '#2563eb',
    className: 'theme-modern'
  },
  {
    id: 'SEPIA',
    name: 'Reader Sepia',
    bg: '#f4ecd8',
    text: '#433422',
    accent: '#8b5e3c',
    className: 'theme-sepia'
  },
  {
    id: 'NOTEBOOK',
    name: 'Caderno Pautado',
    bg: '#fdfdf7',
    text: '#334155',
    accent: '#f43f5e',
    className: 'theme-notebook'
  }
];

export const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Em Branco',
    description: 'Documento vazio para começar do zero',
    markdown: '# Novo Documento\n\nComece a escrever aqui...',
    header: '',
    footer: ''
  },
  {
    id: 'bioq',
    name: 'Bioquímica',
    description: 'Aula completa com tabelas e diagramas Mermaid',
    markdown: `# Metabolismo da Glicose\n\n## Introdução\nA glicólise é a via metabólica que converte glicose em piruvato.\n\n### Ciclo de Reações\n\n| Fase | Reação | Enzima |\n| :--- | :--- | :--- |\n| 1 | Fosforilação | Hexocinase |\n| 2 | Isomerização | Fosfoglicose isomerase |\n\n## Fluxograma do Processo\n\n\`\`\`mermaid\ngraph TD\n    A[Glicose] --> B[Glicose-6-P]\n    B --> C[Frutose-6-P]\n    C --> D[Piruvato]\n    D --> E{Oxigênio?}\n    E -- Sim --> F[Ciclo de Krebs]\n    E -- Não --> G[Lactato]\n\`\`\`\n\n## Notas Adicionais\n- Ocorre no citosol\n- Rendimento líquido de 2 ATP`,
    header: 'StaticMD | Material Didático de Bioquímica',
    footer: 'Página {page} - Universidade Exemplo'
  },
  {
    id: 'corp',
    name: 'Relatório Corporativo',
    description: 'Relatório executivo com header/footer profissional',
    markdown: `# Relatório Executivo Trimestral\n\n## Sumário Executivo\nEste documento detalha o desempenho operacional do Q3.\n\n### Resultados Principais\n1. Aumento de **25%** na eficiência.\n2. Redução de custos em **10%**.\n\n## Análise de Fluxo\n\n\`\`\`mermaid\ngraph LR\n    I[Início] --> P[Processamento]\n    P --> O[Output]\n    O --> R[Revisão]\n    R --> I\n\`\`\`\n\n> "A inovação diferencia um líder de um seguidor." - Steve Jobs`,
    header: '**RELATÓRIO DE DESEMPENHO** | Confidencial',
    footer: '© 2024 Corporação Alpha - Todos os direitos reservados'
  }
];

// Fix: Changed from strings to objects to satisfy React's style attribute requirement and allow spreading in components
export const FONTS = {
  sans: { fontFamily: '"Inter", sans-serif' },
  serif: { fontFamily: '"Lora", serif' },
  mono: { fontFamily: '"JetBrains Mono", monospace' }
};
