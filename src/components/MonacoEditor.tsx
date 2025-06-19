
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

  const syntaxHighlight = (code: string) => {
    if (!code) return '';
    
    // Escape HTML first to prevent issues
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    return escaped
      // Keywords - using gold color for keywords
      .replace(/(fn|let|mut|pub|struct|enum|impl|match|if|else|for|while|loop|break|continue|return|use|mod|const|static|trait|type|where|unsafe|async|await|move|ref|in|as|crate|super|self|Self)\b/g, 
        '<span style="color: #f59e0b;">$1</span>')
      // Types - using lighter gold
      .replace(/\b(i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Vec|Option|Result|Box|Rc|Arc|RefCell|Mutex|HashMap|HashSet)\b/g,
        '<span style="color: #fbbf24;">$1</span>')
      // String literals - using light charcoal
      .replace(/(r#*"[^"]*"#*|"[^"]*"|'[^']*')/g, 
        '<span style="color: #b0b0b0;">$1</span>')
      // Comments - using muted charcoal
      .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, 
        '<span style="color: #6d6d6d;">$1</span>')
      // Numbers - using gold
      .replace(/\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fF]?)\b/g, 
        '<span style="color: #fcd34d;">$1</span>')
      // Macros - using bright gold
      .replace(/(\w+!)/g,
        '<span style="color: #f59e0b;">$1</span>')
      // Boolean literals - using gold
      .replace(/\b(true|false)\b/g,
        '<span style="color: #fbbf24;">$1</span>');
  };

  const runCode = () => {
    // Simulate code execution
    setOutput(`Running Orus code...\n\nCode executed successfully!\nOutput: Hello, Orus!\n\nExecution time: 23ms`);
    setIsOutputVisible(true);
  };

  const clearOutput = () => {
    setOutput('');
    setIsOutputVisible(false);
  };

  return (
    <div className="flex flex-col bg-charcoal-900 text-charcoal-100 h-full">
      {/* Toolbar */}
      <div className="bg-charcoal-800 px-4 py-2 border-b border-charcoal-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-charcoal-300">Orus Editor</span>
          <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={runCode}
            className="px-3 py-1 bg-gold-600 hover:bg-gold-700 text-charcoal-900 text-sm rounded transition-colors"
          >
            Run
          </button>
          <button
            onClick={() => setIsOutputVisible(!isOutputVisible)}
            className="px-3 py-1 bg-charcoal-600 hover:bg-charcoal-700 text-charcoal-100 text-sm rounded transition-colors"
          >
            {isOutputVisible ? 'Hide Output' : 'Show Output'}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex bg-charcoal-950 text-charcoal-100 font-mono text-sm flex-1">
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
            className="absolute inset-0 w-full h-full p-4 bg-transparent leading-6 resize-none outline-none border-none whitespace-pre-wrap break-words text-charcoal-100"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
              caretColor: '#f59e0b',
              color: '#e5e7eb',
              zIndex: 2
            }}
            placeholder="Write your Orus code here..."
            spellCheck={false}
          />
        </div>
      </div>

      {/* Output Section */}
      {isOutputVisible && (
        <div className="bg-charcoal-900 border-t border-charcoal-700">
          <div className="px-4 py-2 bg-charcoal-800 border-b border-charcoal-700 flex items-center justify-between">
            <span className="text-sm font-medium text-charcoal-300">Output</span>
            <button
              onClick={clearOutput}
              className="px-2 py-1 bg-charcoal-600 hover:bg-charcoal-700 text-charcoal-100 text-xs rounded transition-colors"
            >
              Clear
            </button>
          </div>
          <div 
            className="p-4 font-mono text-sm text-charcoal-100 whitespace-pre-wrap overflow-auto resize-y min-h-[100px] max-h-[400px] bg-charcoal-950"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace'
            }}
          >
            {output || 'No output yet. Click "Run" to execute your code.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonacoEditor;
