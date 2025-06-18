
import React from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  forceDarkMode?: boolean;
}

const MonacoEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  height = '400px',
  forceDarkMode = false 
}: MonacoEditorProps) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={handleEditorChange}
      theme={forceDarkMode ? 'vs-dark' : 'light'}
      options={{
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        minimap: { enabled: false },
      }}
    />
  );
};

export default MonacoEditor;
