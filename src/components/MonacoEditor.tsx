
import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
}

const MonacoEditor = ({ 
  value, 
  onChange, 
  language = 'rust',
  theme = 'vs-dark',
  height = '400px',
  readOnly = false 
}: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = monaco;
    
    // Configure Orus language (using Rust syntax for now)
    monaco.languages.register({ id: 'orus' });
    monaco.languages.setMonarchTokensProvider('orus', {
      tokenizer: {
        root: [
          [/\b(fn|let|mut|if|else|match|loop|while|for|in|return|break|continue|struct|enum|impl|trait|use|mod|pub|const|static)\b/, 'keyword'],
          [/\b(i8|i16|i32|i64|u8|u16|u32|u64|f32|f64|bool|char|str|String|Vec|Option|Result)\b/, 'type'],
          [/".*?"/, 'string'],
          [/'.'/, 'string'],
          [/\d+/, 'number'],
          [/\/\/.*$/, 'comment'],
          [/\/\*[\s\S]*?\*\//, 'comment'],
        ]
      }
    });

    // Set custom theme
    monaco.editor.defineTheme('orus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#6B7280' },
        { token: 'keyword', foreground: '#F59E0B' },
        { token: 'string', foreground: '#10B981' },
        { token: 'number', foreground: '#3B82F6' },
        { token: 'type', foreground: '#8B5CF6' },
      ],
      colors: {
        'editor.background': '#1A1A1A',
        'editor.foreground': '#E5E7EB',
        'editorLineNumber.foreground': '#6B7280',
        'editor.selectionBackground': '#F59E0B33',
        'editor.lineHighlightBackground': '#F59E0B0A',
        'editorCursor.foreground': '#F59E0B',
      }
    });
    
    monaco.editor.setTheme('orus-dark');
  };

  return (
    <div className="h-full w-full border border-charcoal-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language === 'orus' ? 'rust' : language}
        theme="orus-dark"
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Fira Code, monospace',
          tabSize: 4,
          insertSpaces: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          renderWhitespace: 'selection',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
