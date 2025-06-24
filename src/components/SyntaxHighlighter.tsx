
interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  className?: string;
}

const SyntaxHighlighter = ({ code, language = 'orus', className = '' }: SyntaxHighlighterProps) => {

  const highlightSyntax = (code: string): string => {
    if (!code) return '';

    // Work with original code and build highlighted version step by step
    let result = code;

    // Define all our patterns and their replacements
    const patterns = [
      // Comments first (to avoid interfering with other patterns)
      { pattern: /(\/\/[^\r\n]*)/g, replacement: '{{COMMENT_START}}$1{{COMMENT_END}}' },
      { pattern: /(\/\*[\s\S]*?\*\/)/g, replacement: '{{COMMENT_START}}$1{{COMMENT_END}}' },
      
      // Strings (both single and double quotes)
      { pattern: /("(?:[^"\\]|\\.)*")/g, replacement: '{{STRING_START}}$1{{STRING_END}}' },
      { pattern: /('(?:[^'\\]|\\.)*')/g, replacement: '{{STRING_START}}$1{{STRING_END}}' },
      
      // Numbers
      { pattern: /\b(\d+(?:\.\d+)?)\b/g, replacement: '{{NUMBER_START}}$1{{NUMBER_END}}' },
      
      // Keywords
      { pattern: /\b(fn|let|mut|const|static|struct|impl|if|elif|else|match|for|while|in|return|use|pub|try|catch|as|break|continue|true|false|nil|loop|enum)\b/g, replacement: '{{KEYWORD_START}}$1{{KEYWORD_END}}' },
      
      // Types
      { pattern: /\b(i32|i64|u32|u64|f64|bool|string|void|self|Option|Result)\b/g, replacement: '{{TYPE_START}}$1{{TYPE_END}}' },
      
      // Built-in functions (only when followed by parentheses)
      { pattern: /\b(print|println|input|len|push|pop|reserve|type_of|timestamp|int|float|read_file|write_file|split|join|trim|upper|lower|contains|starts_with|ends_with|abs|sqrt|pow|sin|cos|tan|floor|ceil|round|random|random_int|sleep|sort|reverse|insert|remove)(?=\s*\()/g, replacement: '{{BUILTIN_START}}$1{{BUILTIN_END}}' },
      
      // Function names (not built-ins, before parentheses)
      { pattern: /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g, replacement: (match: string, name: string) => {
        // Skip if it's already marked as builtin
        if (match.includes('{{BUILTIN_')) return match;
        return `{{FUNCTION_START}}${name}{{FUNCTION_END}}(`;
      }},
      
      // Struct/Type names (capitalized identifiers)
      { pattern: /\b([A-Z][a-zA-Z0-9_]*)\b/g, replacement: (match: string, name: string) => {
        // Skip if already marked with any tag
        if (match.includes('{{')) return match;
        return `{{STRUCT_START}}${name}{{STRUCT_END}}`;
      }}
    ];

    // Apply all patterns
    patterns.forEach(({ pattern, replacement }) => {
      if (typeof replacement === 'string') {
        result = result.replace(pattern, replacement);
      } else {
        result = result.replace(pattern, replacement);
      }
    });

    // Now escape HTML entities
    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Finally, replace our markers with actual HTML spans
    result = result
      .replace(/\{\{COMMENT_START\}\}/g, '<span class="text-gray-500">')
      .replace(/\{\{COMMENT_END\}\}/g, '</span>')
      .replace(/\{\{STRING_START\}\}/g, '<span class="text-green-400">')
      .replace(/\{\{STRING_END\}\}/g, '</span>')
      .replace(/\{\{NUMBER_START\}\}/g, '<span class="text-orange-400">')
      .replace(/\{\{NUMBER_END\}\}/g, '</span>')
      .replace(/\{\{KEYWORD_START\}\}/g, '<span class="text-purple-400">')
      .replace(/\{\{KEYWORD_END\}\}/g, '</span>')
      .replace(/\{\{TYPE_START\}\}/g, '<span class="text-blue-400">')
      .replace(/\{\{TYPE_END\}\}/g, '</span>')
      .replace(/\{\{BUILTIN_START\}\}/g, '<span class="text-yellow-400">')
      .replace(/\{\{BUILTIN_END\}\}/g, '</span>')
      .replace(/\{\{FUNCTION_START\}\}/g, '<span class="text-yellow-300">')
      .replace(/\{\{FUNCTION_END\}\}/g, '</span>')
      .replace(/\{\{STRUCT_START\}\}/g, '<span class="text-cyan-400">')
      .replace(/\{\{STRUCT_END\}\}/g, '</span>');

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
