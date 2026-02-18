
import React, { useRef } from 'react';
import Toolbar from './Toolbar';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (text: string) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const currentVal = value;
    const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
    onChange(newVal);
    
    // Focus back after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + text.length, start + text.length);
      }
    }, 0);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <Toolbar onInsert={insertText} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50 focus:bg-white transition-colors"
        placeholder="# Comece seu documento aqui..."
        spellCheck={false}
      />
    </div>
  );
};

export default Editor;
