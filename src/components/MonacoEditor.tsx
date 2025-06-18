
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
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);

  console.log('MonacoEditor rendering - value length:', value.length, 'readOnly:', readOnly);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    console.log('Monaco editor mounted successfully');
    editorRef.current = editor;
    setIsEditorReady(true);
    
    // Simple configuration without complex language setup
    try {
      monaco.editor.defineTheme('rust-playground-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#1E1E1E',
          'editor.foreground': '#D4D4D4',
        }
      });
      
      monaco.editor.setTheme('rust-playground-dark');
      
      // Focus the editor to enable typing
      editor.focus();
      console.log('Editor focused and ready for input');
    } catch (error) {
      console.error('Error configuring Monaco editor:', error);
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    console.log('Monaco editor content changed, new value:', value);
    if (value !== undefined) {
      onChange(value);
    }
  };

  // Simple fallback textarea
  if (editorError) {
    console.log('Monaco editor failed, showing textarea fallback');
    return (
      <div className="h-full w-full">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-gray-900 text-gray-200 font-mono text-sm p-4 resize-none border-none outline-none"
          style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          readOnly={readOnly}
          placeholder="Enter your Rust code here..."
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
          smoothScrolling: true,
          cursorBlinking: 'blink',
          padding: { top: 16, bottom: 16 },
          selectOnLineNumbers: true,
          roundedSelection: false,
          renderIndentGuides: true,
          cursorSurroundingLines: 0,
          cursorSurroundingLinesStyle: 'default',
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          snippetSuggestions: 'top',
          tabCompletion: 'on',
          wordBasedSuggestions: 'matchingDocuments',
          semanticHighlighting: true
        }}
      />
    </div>
  );
};

export default MonacoEditor;
