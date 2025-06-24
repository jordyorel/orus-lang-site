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
  onChange
}: MonacoEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState<number>(1);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [matchingBrackets, setMatchingBrackets] = useState<{start: number, end: number} | null>(null);

  useEffect(() => {
    const lines = value.split('\n');
    const numbers = lines.map((_, index) => (index + 1).toString());
    setLineNumbers(numbers);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    updateCurrentLine(e.target);
  };

  const updateCurrentLine = (textarea: HTMLTextAreaElement) => {
    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPos);
    const lineNumber = textBeforeCursor.split('\n').length;
    setCurrentLine(lineNumber);
    
    // Update bracket matching
    findMatchingBracket(cursorPos);
  };

  const findMatchingBracket = (cursorPos: number) => {
    const brackets = ['()', '[]', '{}'];
    const openBrackets = ['(', '[', '{'];
    const closeBrackets = [')', ']', '}'];
    
    const charAtCursor = value.charAt(cursorPos);
    const charBeforeCursor = value.charAt(cursorPos - 1);
    
    let searchChar = '';
    let searchPos = cursorPos;
    let isOpenBracket = false;
    
    // Check if cursor is on or after a bracket
    if (openBrackets.includes(charAtCursor)) {
      searchChar = charAtCursor;
      searchPos = cursorPos;
      isOpenBracket = true;
    } else if (closeBrackets.includes(charAtCursor)) {
      searchChar = charAtCursor;
      searchPos = cursorPos;
      isOpenBracket = false;
    } else if (openBrackets.includes(charBeforeCursor)) {
      searchChar = charBeforeCursor;
      searchPos = cursorPos - 1;
      isOpenBracket = true;
    } else if (closeBrackets.includes(charBeforeCursor)) {
      searchChar = charBeforeCursor;
      searchPos = cursorPos - 1;
      isOpenBracket = false;
    }
    
    if (!searchChar) {
      setMatchingBrackets(null);
      return;
    }
    
    const bracketPair = brackets.find(pair => pair.includes(searchChar));
    if (!bracketPair) {
      setMatchingBrackets(null);
      return;
    }
    
    const openChar = bracketPair[0];
    const closeChar = bracketPair[1];
    
    let matchPos = -1;
    let count = 1;
    
    if (isOpenBracket) {
      // Search forward for closing bracket
      for (let i = searchPos + 1; i < value.length; i++) {
        const char = value.charAt(i);
        if (char === openChar) count++;
        else if (char === closeChar) {
          count--;
          if (count === 0) {
            matchPos = i;
            break;
          }
        }
      }
    } else {
      // Search backward for opening bracket
      for (let i = searchPos - 1; i >= 0; i--) {
        const char = value.charAt(i);
        if (char === closeChar) count++;
        else if (char === openChar) {
          count--;
          if (count === 0) {
            matchPos = i;
            break;
          }
        }
      }
    }
    
    if (matchPos !== -1) {
      setMatchingBrackets({ start: Math.min(searchPos, matchPos), end: Math.max(searchPos, matchPos) });
    } else {
      setMatchingBrackets(null);
    }
  };

  const handleCursorMove = (e: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    // Small delay to ensure cursor position is updated
    setTimeout(() => updateCurrentLine(textarea), 0);
  };

  const toggleComment = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Get selected lines
    const lines = value.split('\n');
    const startLineIndex = value.substring(0, start).split('\n').length - 1;
    const endLineIndex = value.substring(0, end).split('\n').length - 1;
    
    // Check if all selected lines are commented
    const selectedLines = lines.slice(startLineIndex, endLineIndex + 1);
    const allCommented = selectedLines.every(line => line.trim().startsWith('//'));
    
    // Toggle comments
    for (let i = startLineIndex; i <= endLineIndex; i++) {
      if (allCommented) {
        // Remove comments
        lines[i] = lines[i].replace(/^(\s*)\/\/\s?/, '$1');
      } else {
        // Add comments
        const match = lines[i].match(/^(\s*)/);
        const indent = match ? match[1] : '';
        lines[i] = lines[i].replace(/^(\s*)/, '$1// ');
      }
    }
    
    const newValue = lines.join('\n');
    onChange(newValue);
  };

  const duplicateSelection = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start === end) {
      // No selection - duplicate current line
      const lines = value.split('\n');
      const lineIndex = value.substring(0, start).split('\n').length - 1;
      const currentLine = lines[lineIndex];
      
      lines.splice(lineIndex + 1, 0, currentLine);
      const newValue = lines.join('\n');
      onChange(newValue);
      
      // Move cursor to the duplicated line
      const newPos = start + currentLine.length + 1;
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newPos;
      }, 0);
    } else {
      // Duplicate selection
      const selectedText = value.substring(start, end);
      const newValue = value.substring(0, end) + selectedText + value.substring(end);
      onChange(newValue);
      
      // Select the duplicated text
      setTimeout(() => {
        textarea.selectionStart = end;
        textarea.selectionEnd = end + selectedText.length;
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Handle escape key
    if (e.key === 'Escape' && isSearchOpen) {
      setIsSearchOpen(false);
      setSearchTerm('');
      return;
    }

    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'f':
          e.preventDefault();
          setIsSearchOpen(true);
          return;
        case '/':
          e.preventDefault();
          toggleComment();
          return;
        case 'd':
          e.preventDefault();
          duplicateSelection();
          return;
      }
    }

    // Update current line for navigation keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      setTimeout(() => updateCurrentLine(textarea), 0);
    }

    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
      return;
    }

    // Enter key for auto-indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Get current line
      const lines = value.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Calculate indentation
      const indentMatch = currentLine.match(/^(\s*)/);
      const currentIndent = indentMatch ? indentMatch[1] : '';
      
      // Check if we need extra indentation (after opening brackets)
      const needsExtraIndent = /[{\[(]\s*$/.test(currentLine.trim());
      const extraIndent = needsExtraIndent ? '    ' : '';
      
      // Check if next character is a closing bracket
      const nextChar = value.charAt(start);
      const isClosingBracket = /[}\])]/.test(nextChar);
      
      let newValue: string;
      let newCursorPos: number;
      
      if (needsExtraIndent && isClosingBracket) {
        // Add two lines: one indented, one with current indentation
        newValue = value.substring(0, start) + 
                  '\n' + currentIndent + extraIndent + 
                  '\n' + currentIndent + 
                  value.substring(end);
        newCursorPos = start + 1 + currentIndent.length + extraIndent.length;
      } else {
        // Normal enter with indentation
        newValue = value.substring(0, start) + 
                  '\n' + currentIndent + extraIndent + 
                  value.substring(end);
        newCursorPos = start + 1 + currentIndent.length + extraIndent.length;
      }
      
      onChange(newValue);
      
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      }, 0);
      return;
    }

    // Auto-closing brackets, parentheses, and quotes
    const pairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    if (pairs[e.key]) {
      // For quotes, check if we're inside a string
      const beforeCursor = value.substring(0, start);
      const isInsideString = (char: string) => {
        const matches = beforeCursor.match(new RegExp(`[^\\\\]${char}`, 'g')) || [];
        return matches.length % 2 === 1;
      };

      // Skip auto-closing for quotes if already inside a string of the same type
      if ((e.key === '"' || e.key === "'") && isInsideString(e.key)) {
        return; // Let default behavior handle it
      }

      // Skip if next character is the same (for quotes)
      const nextChar = value.charAt(start);
      if ((e.key === '"' || e.key === "'") && nextChar === e.key) {
        e.preventDefault();
        // Move cursor past the existing quote
        onChange(value);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }

      e.preventDefault();
      const closeChar = pairs[e.key];
      const newValue = value.substring(0, start) + e.key + closeChar + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Handle closing brackets - skip if next character matches
    if (/[}\])]/.test(e.key)) {
      const nextChar = value.charAt(start);
      if (nextChar === e.key) {
        e.preventDefault();
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
        return;
      }
    }

    // Handle Backspace for bracket pairs
    if (e.key === 'Backspace') {
      const prevChar = value.charAt(start - 1);
      const nextChar = value.charAt(start);
      
      // Check if we're deleting an opening bracket with its matching closing bracket
      const isPair = (
        (prevChar === '(' && nextChar === ')') ||
        (prevChar === '[' && nextChar === ']') ||
        (prevChar === '{' && nextChar === '}') ||
        (prevChar === '"' && nextChar === '"') ||
        (prevChar === "'" && nextChar === "'")
      );
      
      if (isPair && start === end) {
        e.preventDefault();
        const newValue = value.substring(0, start - 1) + value.substring(start + 1);
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start - 1;
        }, 0);
        return;
      }
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    return code
      // Comments
      .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>')
      // Strings
      .replace(/("([^"\\]|\\.)*")/g, '<span class="text-green-400">$1</span>')
      .replace(/('([^'\\]|\\.)*')/g, '<span class="text-green-400">$1</span>')
      // Numbers
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-orange-400">$1</span>')
      // Keywords
      .replace(/\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil)\b/g, '<span class="text-purple-400">$1</span>')
      // Types
      .replace(/\b(i32|i64|u32|u64|f64|bool|string|void|self)\b/g, '<span class="text-blue-400">$1</span>')
      // Built-in functions
      .replace(/\b(print|input|len|push|pop|reserve|type_of|timestamp|int|float)\b/g, '<span class="text-yellow-400">$1</span>')
      // Function names
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, '<span class="text-yellow-300">$1</span>')
      // Struct names (capitalized)
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="text-cyan-400">$1</span>');
  };

  const processedValue = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const highlightSearchTerms = (code: string): string => {
    if (!code) return '';
    
    let highlighted = highlightSyntax(code);
    
    // Add search highlighting
    if (searchTerm) {
      const searchRegex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlighted = highlighted.replace(searchRegex, '<mark class="bg-yellow-400 text-black">$1</mark>');
    }
    
    // Add bracket highlighting
    if (matchingBrackets) {
      const { start, end } = matchingBrackets;
      
      // Convert positions to highlighted positions
      let currentPos = 0;
      let result = '';
      
      for (let i = 0; i < highlighted.length; i++) {
        if (highlighted[i] === '<') {
          // Skip HTML tags
          const tagEnd = highlighted.indexOf('>', i);
          if (tagEnd !== -1) {
            result += highlighted.substring(i, tagEnd + 1);
            i = tagEnd;
            continue;
          }
        }
        
        if (highlighted[i] === '&') {
          // Skip HTML entities
          const entityEnd = highlighted.indexOf(';', i);
          if (entityEnd !== -1) {
            result += highlighted.substring(i, entityEnd + 1);
            i = entityEnd;
            currentPos++;
            continue;
          }
        }
        
        if (currentPos === start || currentPos === end) {
          result += '<span class="bg-blue-500 bg-opacity-30 text-blue-200">';
          result += highlighted[i];
          result += '</span>';
        } else {
          result += highlighted[i];
        }
        
        currentPos++;
      }
      
      return result;
    }
    
    return highlighted;
  };

  return (
    <div className="flex flex-col bg-charcoal-900 text-charcoal-100 h-full border border-charcoal-700">
      {/* Search Bar */}
      {isSearchOpen && (
        <div className="flex items-center gap-2 p-2 bg-charcoal-800 border-b border-charcoal-700">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-1 bg-charcoal-900 border border-charcoal-600 rounded text-sm focus:outline-none focus:border-gold-500"
            autoFocus
          />
          <button
            onClick={() => {setIsSearchOpen(false); setSearchTerm('');}}
            className="px-2 py-1 text-charcoal-400 hover:text-charcoal-200"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Editor with borders */}
      <div className="flex bg-charcoal-950 text-charcoal-100 font-mono text-sm flex-1 min-h-0">
        {/* Line numbers - scrollable */}
        <ScrollArea className="bg-charcoal-900 border-r border-charcoal-700 min-w-[3rem]">
          <div className="px-3 py-4 text-charcoal-500 select-none">
            {lineNumbers.map((num, index) => (
              <div 
                key={index} 
                className={`leading-6 text-right px-1 ${
                  index + 1 === currentLine 
                    ? 'bg-charcoal-700 text-charcoal-100 rounded' 
                    : ''
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Editor area - scrollable */}
        <div className="flex-1 relative min-w-0">
          {/* Current line highlighting */}
          <div className="absolute inset-0 p-4 pointer-events-none z-5">
            <div 
              className="bg-charcoal-800 bg-opacity-50 w-full h-6 absolute"
              style={{
                top: `${16 + (currentLine - 1) * 24}px`,
                left: '16px',
                right: '16px'
              }}
            />
          </div>
          
          {/* Syntax highlighting background */}
          <pre
            ref={highlightRef}
            className="absolute inset-0 p-4 m-0 text-sm font-mono leading-6 text-charcoal-200 overflow-auto pointer-events-none whitespace-pre-wrap break-words z-10"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerms(processedValue) || '<span class="text-charcoal-500">Write your Orus code here...</span>'
            }}
          />

          {/* Input textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleCursorMove}
            onClick={handleCursorMove}
            onScroll={handleScroll}
            className="w-full h-full p-4 bg-transparent text-transparent resize-none outline-none border-none whitespace-pre-wrap break-words relative z-20"
            style={{
              fontFamily: '"Fira Code", "JetBrains Mono", Monaco, Menlo, "Ubuntu Mono", monospace',
              caretColor: '#f59e0b',
              fontSize: '14px',
              lineHeight: '24px'
            }}
            spellCheck={false}
            placeholder=""
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
};

export default MonacoEditor;