
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
  theme = 'vs',
  height = '400px',
  readOnly = false 
}: MonacoEditorProps) => {
  const editorRef = useRef<any>(null);

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

    // Set custom theme similar to Rust playground
    monaco.editor.defineTheme('rust-playground', {
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
    
    monaco.editor.setTheme('rust-playground');
  };

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language={language === 'orus' ? 'rust' : language}
        theme="rust-playground"
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
