
import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

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
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current && !monacoEditorRef.current) {
      // Initialize Monaco Editor
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: value,
        language: language,
        theme: forceDarkMode ? 'vs-dark' : 'vs',
        automaticLayout: true,
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        minimap: { enabled: false },
      });

      // Listen for content changes
      monacoEditorRef.current.onDidChangeModelContent(() => {
        const currentValue = monacoEditorRef.current?.getValue() || '';
        onChange(currentValue);
      });
    }

    return () => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.dispose();
        monacoEditorRef.current = null;
      }
    };
  }, []);

  // Update value when prop changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (currentValue !== value) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  return (
    <div 
      ref={editorRef} 
      style={{ height }} 
      className="w-full"
    />
  );
};

export default MonacoEditor;
