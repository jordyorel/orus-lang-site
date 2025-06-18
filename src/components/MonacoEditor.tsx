
import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from 'next-themes';

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
  height = '400px',
  readOnly = false 
}: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = monaco;
    
    // Configure Orus language (using Rust syntax)
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

    // Set light theme
    monaco.editor.defineTheme('rust-playground-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#008000' },
        { token: 'keyword', foreground: '#0000FF' },
        { token: 'string', foreground: '#A31515' },
        { token: 'number', foreground: '#098658' },
        { token: 'type', foreground: '#2B91AF' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#000000',
        'editorLineNumber.foreground': '#999999',
        'editor.selectionBackground': '#ADD6FF',
        'editor.lineHighlightBackground': '#F5F5F5',
        'editorCursor.foreground': '#000000',
      }
    });

    // Set dark theme
    monaco.editor.defineTheme('rust-playground-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '#6A9955' },
        { token: 'keyword', foreground: '#C586C0' },
        { token: 'string', foreground: '#CE9178' },
        { token: 'number', foreground: '#B5CEA8' },
        { token: 'type', foreground: '#4EC9B0' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264F78',
        'editor.lineHighlightBackground': '#2A2D2E',
        'editorCursor.foreground': '#AEAFAD',
      }
    });
    
    monaco.editor.setTheme(theme === 'dark' ? 'rust-playground-dark' : 'rust-playground-light');
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.editor.setTheme(theme === 'dark' ? 'rust-playground-dark' : 'rust-playground-light');
    }
  }, [theme]);

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={language === 'orus' ? 'rust' : language}
        theme={theme === 'dark' ? 'rust-playground-dark' : 'rust-playground-light'}
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          tabSize: 4,
          insertSpaces: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          renderWhitespace: 'selection',
          smoothScrolling: true,
          cursorBlinking: 'blink',
          bracketPairColorization: { enabled: true },
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
