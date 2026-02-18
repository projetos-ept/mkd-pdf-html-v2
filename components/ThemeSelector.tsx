
import React from 'react';
import { THEMES } from '../constants';
import { ThemeId } from '../types';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelect: (id: ThemeId) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ currentTheme, onSelect }) => {
  return (
    <div className="p-4 border-t bg-white">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
        <Palette size={14} /> Temas Visuais
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelect(theme.id)}
            className={`
              p-2 rounded-lg border-2 text-xs font-medium transition-all
              ${currentTheme === theme.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                : 'border-gray-100 hover:border-gray-200 bg-gray-50 text-gray-600'}
            `}
          >
            <div 
              className="w-full h-8 rounded mb-1 border"
              style={{ backgroundColor: theme.bg }}
            />
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
