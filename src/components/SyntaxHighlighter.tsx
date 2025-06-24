
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
      // Comments (do this first to avoid interfering with other patterns)
      .replace(/(\/\/[^\r\n]*)/g, '<span class="text-gray-500">$1</span>')
      // Block comments (multi-line)
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
      // Strings (handle both single and double quotes)
      .replace(/(&quot;(?:[^&]|&(?!quot;))*&quot;)/g, '<span class="text-green-400">$1</span>')
      .replace(/(&#39;(?:[^&]|&(?!#39;))*&#39;)/g, '<span class="text-green-400">$1</span>')
      // Numbers (integers and floats)
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-orange-400">$1</span>')
      // Keywords
      .replace(/\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil|loop|enum)\b/g, '<span class="text-purple-400">$1</span>')
      // Types
      .replace(/\b(i32|i64|u32|u64|f64|bool|string|void|self|Option|Result)\b/g, '<span class="text-blue-400">$1</span>')
      // Built-in functions
      .replace(/\b(print|println|input|len|push|pop|reserve|type_of|timestamp|int|float|read_file|write_file|split|join|trim|upper|lower|contains|starts_with|ends_with|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|random|random_int|sleep|sort|reverse|insert|remove)\b(?=\s*\()/g, '<span class="text-yellow-400">$1</span>')
      // Function names (before parentheses, but not built-ins)
      .replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, name) => {
        // Don't highlight if it's already been highlighted as a built-in
        if (match.includes('class="text-yellow-400"')) {
          return match;
        }
        return `<span class="text-yellow-300">${name}</span>(`;
      })
      // Struct/Type names (capitalized identifiers)
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span class="text-cyan-400">$1</span>')
      // Self keyword
      .replace(/\bself\b/g, '<span class="text-blue-400">self</span>');
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
