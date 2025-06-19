
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
  language = 'rust',
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

  const syntaxHighlight = (code: string) => {
    return code
      // Keywords
      .replace(/(fn|let|mut|pub|struct|enum|impl|match|if|else|for|while|loop|break|continue|return|use|mod|const|static|trait|type|where|unsafe|async|await|move|ref|in|as|crate|super|self|Self)/g, 
        '<span style="color: #ff7b72;">$1</span>')
      // Types
      .replace(/\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Box|Rc|Arc|RefCell|Mutex|HashMap|HashSet)\b/g,
        '<span style="color: #79c0ff;">$1</span>')
      // String literals
      .replace(/(r#*"[^"]*"#*|"[^"]*"|'[^']*')/g, 
        '<span style="color: #a5d6ff;">$1</span>')
      // Comments
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
        '<span style="color: #8b949e;">$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fF]?)\b/g, 
        '<span style="color: #79c0ff;">$1</span>')
      // Macros
      .replace(/(\w+!)/g,
        '<span style="color: #d2a8ff;">$1</span>')
      // Boolean literals
      .replace(/\b(true|false)\b/g,
        '<span style="color: #79c0ff;">$1</span>');
  };

  return (
    <div className="flex h-full bg-gray-900 text-gray-100 font-mono text-sm" style={{ height }}>
      {/* Line numbers */}
      <div className="bg-gray-800 px-3 py-4 text-gray-500 select-none border-r border-gray-700 min-w-[3rem]">
        {lineNumbers.map((num, index) => (
          <div key={index} className="leading-6 text-right">
            {num}
          </div>
        ))}
      </div>
      
      {/* Editor area */}
      <div className="flex-1 relative">
        {/* Syntax highlighted background */}
        <div 
          className="absolute inset-0 p-4 leading-6 text-transparent pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
          dangerouslySetInnerHTML={{ 
            __html: syntaxHighlight(value || '').replace(/\n/g, '<br/>') 
          }}
        />
        
        {/* Actual textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full p-4 bg-transparent text-gray-100 leading-6 resize-none outline-none border-none whitespace-pre-wrap break-words"
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
            caretColor: '#ffffff'
          }}
          placeholder="Write your Rust code here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export default MonacoEditor;
