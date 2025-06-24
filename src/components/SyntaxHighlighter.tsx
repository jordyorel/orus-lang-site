
interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    // Start with the original code
    let result = code;

    // First, escape HTML entities to prevent issues
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply syntax highlighting patterns in order
    // Comments first (to avoid interfering with other patterns)
    result = result.replace(/(\/\/[^\r\n]*)/g, '<span class="text-gray-500">$1</span>');
    result = result.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
    
    // Strings (both single and double quotes)
    result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="text-green-400">$1</span>');
    result = result.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="text-green-400">$1</span>');
    
    // Numbers
    result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="text-orange-400">$1</span>');
    
    // Keywords
    result = result.replace(/\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil|loop|enum)\b/g, '<span class="text-purple-400">$1</span>');
    
    // Types
    result = result.replace(/\b(i32|i64|u32|u64|f64|bool|string|void|self|Option|Result)\b/g, '<span class="text-blue-400">$1</span>');
    
    // Built-in functions (only when followed by parentheses)
    result = result.replace(/\b(print|println|input|len|push|pop|reserve|type_of|timestamp|int|float|read_file|write_file|split|join|trim|upper|lower|contains|starts_with|ends_with|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|random|random_int|sleep|sort|reverse|insert|remove)(?=\s*\()/g, '<span class="text-yellow-400">$1</span>');
    
    // Function names (not built-ins, before parentheses) - need to be more careful here
    result = result.replace(/(?<!<span[^>]*>)\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, (match, name) => {
      // Skip if it's already wrapped in a span (built-in function)
      return match.includes('span') ? match : `<span class="text-yellow-300">${name}</span>(`;
    });
    
    // Struct/Type names (capitalized identifiers) - be careful not to match already highlighted text
    result = result.replace(/(?<!<span[^>]*>)\b([A-Z][a-zA-Z0-9_]*)(?![^<]*<\/span>)/g, '<span class="text-cyan-400">$1</span>');

    return result;
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
