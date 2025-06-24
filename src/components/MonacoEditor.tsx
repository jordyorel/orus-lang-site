
import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
    <div className="flex flex-col bg-charcoal-900 text-charcoal-100 h-full border border-charcoal-700">
      {/* Editor with borders */}
      <div className="flex bg-charcoal-950 text-charcoal-100 font-mono text-sm flex-1 min-h-0">
        {/* Line numbers - scrollable */}
        <ScrollArea className="bg-charcoal-900 border-r border-charcoal-700 min-w-[3rem]">
          <div className="px-3 py-4 text-charcoal-500 select-none">
            {lineNumbers.map((num, index) => (
              <div key={index} className="leading-6 text-right">
                {num}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Editor area - scrollable */}
        <div className="flex-1 relative min-w-0">
          <ScrollArea className="h-full">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full min-h-full p-4 bg-transparent leading-6 resize-none outline-none border-none whitespace-pre-wrap break-words text-charcoal-100"
              style={{
                fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
                caretColor: '#f59e0b',
                color: '#e5e7eb'
              }}
              placeholder="Write your Orus code here..."
              spellCheck={false}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;
