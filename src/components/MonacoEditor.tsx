import { useState, useRef, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

const CodeEditor = ({ 
  value, 
  onChange,
  language = 'javascript',
  height = '400px',
  readOnly = false
}: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);

  // Update line numbers when content changes
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
      
      // Insert tab
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const syntaxHighlight = (code: string) => {
    if (language === 'javascript' || language === 'rust') {
      return code
        .replace(/(function|const|let|var|if|else|for|while|return|import|export|class|interface|type|fn|let|mut|pub|struct|enum|impl|match|if|else|for|while|loop|break|continue)/g, 
          '<span style="color: #569cd6;">$1</span>')
        .replace(/(true|false|null|undefined)/g, 
          '<span style="color: #4fc1ff;">$1</span>')
        .replace(/('[^']*'|"[^"]*"|`[^`]*`)/g, 
          '<span style="color: #ce9178;">$1</span>')
        .replace(/(\/\/.*$)/gm, 
          '<span style="color: #6a9955;">$1</span>')
        .replace(/(\d+)/g, 
          '<span style="color: #b5cea8;">$1</span>');
    }
    return code;
  };

  return (
    <div className="w-full bg-gray-900 rounded-lg overflow-hidden border border-gray-700" style={{ height }}>
      <div className="flex h-full">
        {/* Line numbers */}
        <div className="bg-gray-800 px-3 py-4 text-gray-400 text-sm font-mono select-none border-r border-gray-700 min-w-[3rem]">
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
            className="absolute inset-0 p-4 text-sm font-mono leading-6 text-transparent pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
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
            readOnly={readOnly}
            className="absolute inset-0 w-full h-full p-4 bg-transparent text-gray-100 text-sm font-mono leading-6 resize-none outline-none border-none whitespace-pre-wrap break-words"
            style={{
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              caretColor: '#ffffff'
            }}
            placeholder={readOnly ? '' : 'Start typing your code...'}
            spellCheck={false}
          />
        </div>
      </div>
      
      {/* Status bar */}
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-t border-gray-700 flex justify-between">
        <span>{language.toUpperCase()}</span>
        <span>Lines: {lineNumbers.length} | Characters: {value.length}</span>
      </div>
    </div>
  );
};

// Demo component
export default function CodeEditorDemo() {
  const [code, setCode] = useState(`// Welcome to the code editor!
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));

// Try editing this code
const greeting = "Hello, World!";
console.log(greeting);`);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Code Editor</h1>
      <div className="mb-4">
        <CodeEditor
          value={code}
          onChange={setCode}
          language="javascript"
          height="500px"
        />
      </div>
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Features:</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-1">
          <li>Syntax highlighting for JavaScript and Rust</li>
          <li>Line numbers</li>
          <li>Tab support (inserts 2 spaces)</li>
          <li>Dark theme optimized for coding</li>
          <li>Character and line count display</li>
          <li>Proper font family for code</li>
        </ul>
      </div>
    </div>
  );
}