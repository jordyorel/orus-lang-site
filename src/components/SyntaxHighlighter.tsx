
interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    // Escape HTML entities first
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    return escapedCode
      // Comments
      .replace(/(\/\/.*)/g, '<span class="text-gray-500">$1</span>')
      // Block comments
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
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

  const renderHighlightedCode = () => {
    if (language !== 'orus') {
      return <span className="text-charcoal-200">{code}</span>;
    }

    return (
      <span
        dangerouslySetInnerHTML={{
          __html: highlightSyntax(code)
        }}
      />
    );
  };

  return (
    <div className={`bg-charcoal-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      <pre className="text-sm font-mono leading-6 text-left">
        <code className="text-charcoal-200">
          {renderHighlightedCode()}
        </code>
      </pre>
    </div>
  );
};

export default SyntaxHighlighter;