
import React, { useState, useRef, useEffect } from 'react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  forceDarkMode?: boolean;
}

const MonacoEditor = ({ 
  value, 
  onChange,
  language = 'orus',
  height = '100%',
  forceDarkMode = false 
}: MonacoEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const [isOutputVisible, setIsOutputVisible] = useState(false);

  useEffect(() => {
    const lines = value.split('\n');
    const numbers = lines.map((_, index) => (index + 1).toString());
    setLineNumbers(numbers);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-950 text-gray-100">
      {/* Editor */}
      <div className="flex-1 flex bg-charcoal-950 text-gray-100 font-mono text-sm min-h-0">
        {/* Line numbers */}
        <div className="bg-charcoal-900 px-3 py-4 text-charcoal-500 select-none border-r border-charcoal-700 min-w-[3rem]">
          {lineNumbers.map((num, index) => (
            <div key={index} className="leading-6 text-right">
              {num}
            </div>
          ))}
        </div>
        
        {/* Editor area */}
        <div className="flex-1 relative">
          {/* Actual textarea - always visible */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 w-full h-full p-4 bg-transparent leading-6 resize-none outline-none border-none whitespace-pre-wrap break-words text-gray-100"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
              caretColor: '#f59e0b',
              color: '#e5e7eb'
            }}
            placeholder="Write your Orus code here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;
