
import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
  forceDarkMode?: boolean;
}

const MonacoEditor = ({ 
  value, 
  onChange, 
  language = 'rust',
  height = '400px',
  readOnly = false,
  forceDarkMode = false
}: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Monaco editor mounted successfully');
    editorRef.current = monaco;
    
    // Configure Orus language (using Rust syntax)
    if (!monaco.languages.getLanguages().find((lang: any) => lang.id === 'orus')) {
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
    }

    // Set dark theme for playground
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
    
    monaco.editor.setTheme('rust-playground-dark');
  };

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={language === 'orus' ? 'rust' : language}
        theme="rust-playground-dark"
        value={value}
        onChange={(value) => onChange(value || '')}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-charcoal-900 text-charcoal-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500 mx-auto mb-2"></div>
              <p className="text-sm">Loading editor...</p>
            </div>
          </div>
        }
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
