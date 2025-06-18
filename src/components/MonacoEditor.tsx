
import { useEffect, useRef, useState } from 'react';
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
  const [loadingFailed, setLoadingFailed] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  console.log('MonacoEditor rendering - value length:', value.length, 'readOnly:', readOnly);

  // Set a timeout to fallback to textarea if Monaco takes too long
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Monaco editor loading timeout, switching to textarea');
      setLoadingTimeout(true);
    }, 5000); // 5 second timeout

    return () => clearTimeout(timer);
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Monaco editor mounted successfully');
    editorRef.current = editor;
    
    try {
      // Set dark theme
      monaco.editor.setTheme('vs-dark');
      
      // Focus the editor
      editor.focus();
      console.log('Editor focused and ready for input');
    } catch (error) {
      console.error('Error configuring Monaco editor:', error);
      setLoadingFailed(true);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    console.log('Monaco editor content changed');
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEditorLoadingError = (error: any) => {
    console.error('Monaco editor failed to load:', error);
    setLoadingFailed(true);
  };

  // Use textarea fallback if Monaco fails or times out
  if (loadingFailed || loadingTimeout) {
    console.log('Using textarea fallback');
    return (
      <div className="h-full w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-gray-900 text-gray-200 font-mono text-sm p-4 resize-none border-none outline-none"
          style={{ 
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            lineHeight: '1.5',
            tabSize: 4
          }}
          readOnly={readOnly}
          placeholder="Enter your Rust code here..."
          spellCheck={false}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        language="rust"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900 text-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-2"></div>
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
          cursorBlinking: 'blink',
          padding: { top: 16, bottom: 16 },
          selectOnLineNumbers: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: false,
          parameterHints: { enabled: false },
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: 'off'
        }}
      />
    </div>
  );
};

export default MonacoEditor;
