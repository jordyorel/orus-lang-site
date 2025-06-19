
import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {
  const highlightOrusCode = (code: string): string => {
    return code
      // Comments first (to avoid interfering with other patterns)
      .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>')
      // Strings
      .replace(/"([^"\\]|\\.)*"/g, '<span class="text-green-400">$&</span>')
      .replace(/'([^'\\]|\\.)*'/g, '<span class="text-green-400">$&</span>')
      // Numbers
      .replace(/\b\d+(\.\d+)?\b/g, '<span class="text-orange-400">$&</span>')
      // Keywords
      .replace(/\b(fn|let|mut|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue)\b/g, '<span class="text-purple-400">$1</span>')
      // Types
      .replace(/\b(i32|i64|u32|u64|f64|bool|string|self)\b/g, '<span class="text-blue-400">$1</span>')
      // Built-in functions
      .replace(/\b(print|input|len|push|pop|reserve|type_of|timestamp|int|float)\b/g, '<span class="text-yellow-400">$1</span>')
      // Function names (after fn keyword)
      .replace(/fn\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, 'fn <span class="text-yellow-300">$1</span>')
      // Method calls
      .replace(/\.([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '.<span class="text-yellow-300">$1</span>(')
      // Struct names (capitalized identifiers)
      .replace(/\b[A-Z][a-zA-Z0-9_]*\b/g, '<span class="text-cyan-400">$&</span>');
  };

  const getHighlightedCode = () => {
    if (language === 'orus') {
      return highlightOrusCode(code);
    }
    return code; // No highlighting for other languages
  };

  return (
    <div className={`bg-charcoal-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      <pre className="text-sm font-mono leading-relaxed">
        <code 
          className="text-charcoal-200"
          dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
        />
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;
