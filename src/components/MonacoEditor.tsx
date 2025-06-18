
import { useRef } from 'react';
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

  const handleEditorDidMount = (editor: any) => {
    console.log('Monaco editor mounted successfully');
    editorRef.current = editor;
    editor.focus();
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div className="h-full w-full">
      <Editor
        height={height}
        defaultLanguage="javascript"
        language="javascript"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full bg-gray-900 text-gray-200">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500 mx-auto mb-2"></div>
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
          wordWrap: 'on'
        }}
      />
    </div>
  );
};

export default MonacoEditor;
