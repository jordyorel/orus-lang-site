
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Set a timeout to detect if Monaco is taking too long
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Monaco editor taking too long to load, showing fallback');
        setHasError(true);
        setIsLoading(false);
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isLoading]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Monaco editor mounted successfully');
    editorRef.current = editor;
    setIsLoading(false);
    setHasError(false);
    
    // Simple theme setup
    try {
      monaco.editor.setTheme('vs-dark');
      editor.focus();
    } catch (error) {
      console.warn('Error setting Monaco theme:', error);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleEditorError = () => {
    console.error('Monaco editor failed to load');
    setHasError(true);
    setIsLoading(false);
  };

  // Fallback textarea if Monaco fails
  if (hasError) {
    return (
      <div className="h-full w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-gray-900 text-gray-200 font-mono text-sm p-4 border-none outline-none resize-none"
          placeholder="Code editor (fallback mode)"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500 mx-auto mb-2"></div>
              <p className="text-xs">Loading editor...</p>
            </div>
          </div>
        }
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
          tabSize: 4,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 }
        }}
      />
    </div>
  );
};

export default MonacoEditor;
