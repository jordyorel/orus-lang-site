import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

interface Token {
  type: 'keyword' | 'type' | 'builtin' | 'string' | 'number' | 'comment' | 'function' | 'method' | 'struct' | 'text';
  value: string;
  className: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {
  
  const tokenizeOrusCode = (code: string): Token[] => {
    const tokens: Token[] = [];
    const lines = code.split('\n');
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      let currentIndex = 0;
      
      while (currentIndex < line.length) {
        let matched = false;
        
        // Comments
        if (line.slice(currentIndex).match(/^\/\/.*/)) {
          const match = line.slice(currentIndex).match(/^\/\/.*/)?.[0] || '';
          tokens.push({ type: 'comment', value: match, className: 'text-gray-500' });
          currentIndex += match.length;
          matched = true;
        }
        // Block comments
        else if (line.slice(currentIndex).match(/^\/\*/)) {
          let blockEnd = line.indexOf('*/', currentIndex);
          if (blockEnd === -1) blockEnd = line.length;
          const match = line.slice(currentIndex, blockEnd + 2);
          tokens.push({ type: 'comment', value: match, className: 'text-gray-500' });
          currentIndex = blockEnd + 2;
          matched = true;
        }
        // Strings
        else if (line[currentIndex] === '"') {
          let stringEnd = currentIndex + 1;
          while (stringEnd < line.length && line[stringEnd] !== '"') {
            if (line[stringEnd] === '\\') stringEnd++; // Skip escaped chars
            stringEnd++;
          }
          if (stringEnd < line.length) stringEnd++; // Include closing quote
          const match = line.slice(currentIndex, stringEnd);
          tokens.push({ type: 'string', value: match, className: 'text-green-400' });
          currentIndex = stringEnd;
          matched = true;
        }
        else if (line[currentIndex] === "'") {
          let stringEnd = currentIndex + 1;
          while (stringEnd < line.length && line[stringEnd] !== "'") {
            if (line[stringEnd] === '\\') stringEnd++; // Skip escaped chars
            stringEnd++;
          }
          if (stringEnd < line.length) stringEnd++; // Include closing quote
          const match = line.slice(currentIndex, stringEnd);
          tokens.push({ type: 'string', value: match, className: 'text-green-400' });
          currentIndex = stringEnd;
          matched = true;
        }
        // Numbers
        else if (line.slice(currentIndex).match(/^\d+(\.\d+)?/)) {
          const match = line.slice(currentIndex).match(/^\d+(\.\d+)?/)?.[0] || '';
          tokens.push({ type: 'number', value: match, className: 'text-orange-400' });
          currentIndex += match.length;
          matched = true;
        }
        // Keywords
        else if (line.slice(currentIndex).match(/^(fn|let|mut|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue)\b/)) {
          const match = line.slice(currentIndex).match(/^(fn|let|mut|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue)\b/)?.[0] || '';
          tokens.push({ type: 'keyword', value: match, className: 'text-purple-400' });
          currentIndex += match.length;
          matched = true;
        }
        // Types
        else if (line.slice(currentIndex).match(/^(i32|i64|u32|u64|f64|bool|string|self)\b/)) {
          const match = line.slice(currentIndex).match(/^(i32|i64|u32|u64|f64|bool|string|self)\b/)?.[0] || '';
          tokens.push({ type: 'type', value: match, className: 'text-blue-400' });
          currentIndex += match.length;
          matched = true;
        }
        // Built-in functions
        else if (line.slice(currentIndex).match(/^(print|input|len|push|pop|reserve|type_of|timestamp|int|float)\b/)) {
          const match = line.slice(currentIndex).match(/^(print|input|len|push|pop|reserve|type_of|timestamp|int|float)\b/)?.[0] || '';
          tokens.push({ type: 'builtin', value: match, className: 'text-yellow-400' });
          currentIndex += match.length;
          matched = true;
        }
        // Function names (after fn keyword)
        else if (line.slice(currentIndex).match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/)) {
          const match = line.slice(currentIndex).match(/^([a-zA-Z_][a-zA-Z0-9_]*)/)?.[0] || '';
          tokens.push({ type: 'function', value: match, className: 'text-yellow-300' });
          currentIndex += match.length;
          matched = true;
        }
        // Struct names (capitalized identifiers)
        else if (line.slice(currentIndex).match(/^[A-Z][a-zA-Z0-9_]*\b/)) {
          const match = line.slice(currentIndex).match(/^[A-Z][a-zA-Z0-9_]*/)?.[0] || '';
          tokens.push({ type: 'struct', value: match, className: 'text-cyan-400' });
          currentIndex += match.length;
          matched = true;
        }
        
        if (!matched) {
          tokens.push({ type: 'text', value: line[currentIndex], className: 'text-charcoal-200' });
          currentIndex++;
        }
      }
      
      // Add newline after each line except the last
      if (lineIndex < lines.length - 1) {
        tokens.push({ type: 'text', value: '\n', className: 'text-charcoal-200' });
      }
    }
    
    return tokens;
  };

  const renderHighlightedCode = () => {
    if (language !== 'orus') {
      return <span className="text-charcoal-200">{code}</span>;
    }
    
    const tokens = tokenizeOrusCode(code);
    return tokens.map((token, index) => (
      <span key={index} className={token.className}>
        {token.value}
      </span>
    ));
  };

  return (
    <div className={`bg-charcoal-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      <pre className="text-sm font-mono leading-relaxed text-left">
        <code className="text-charcoal-200">
          {renderHighlightedCode()}
        </code>
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;
