// CodeEditor.tsx: Simple wrapper with error handling
import React, { useRef, useEffect, useState } from 'react';
import { MonacoEditor } from './MonacoEditor';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onRun?: () => void;
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'orus',
  onRun,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<MonacoEditor | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeEditor = () => {
      try {
        if (!containerRef.current) return;

        // Create editor instance directly
        editorRef.current = new MonacoEditor(containerRef.current, {
          value,
          onChange: handleChange,
          language,
          onMount: handleEditorMount,
          onKeyDown: handleKeyDown
        });

        setError(null);
        setIsLoading(false);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize editor';
        setError(errorMessage);
        setIsLoading(false);
        console.error('Editor initialization error:', err);
      }
    };

    // Initialize editor on next tick to ensure container is mounted
    setTimeout(initializeEditor, 0);

    // Cleanup on unmount
    return () => {
      if (editorRef.current && !editorRef.current.isDisposed) {
        editorRef.current.dispose();
      }
    };
  }, []);

  // Update editor value when prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.getValue() !== value) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setLanguage(language);
    }
  }, [language]);

  const handleChange = (newValue: string) => {
    try {
      onChange(newValue);
    } catch (err) {
      console.error('Error in onChange handler:', err);
    }
  };

  const handleEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    try {
      // Add keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        if (onRun) {
          onRun();
        }
      });

      // Focus the editor
      editor.focus();

      // Trigger layout on next tick to ensure proper sizing
      setTimeout(() => {
        editor.layout();
      }, 0);

    } catch (err) {
      console.error('Error in editor mount handler:', err);
    }
  };

  const handleKeyDown = (e: monaco.IKeyboardEvent) => {
    try {
      // Handle additional keyboard shortcuts here if needed
      if (e.ctrlKey && e.code === 'KeyS') {
        e.preventDefault();
        // Could add save functionality here
      }
    } catch (err) {
      console.error('Error in keydown handler:', err);
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    // Re-mount the component
    window.location.reload();
  };

  if (error) {
    return (
      <div className={`code-editor-error ${className}`}>
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            <h3>Editor Failed to Load</h3>
            <p>{error}</p>
            <button 
              className="retry-button"
              onClick={handleRetry}
            >
              Retry
            </button>
          </div>
        </div>
        <style>{`
          .code-editor-error {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1e1e1e;
            color: #d4d4d4;
          }
          .error-content {
            text-align: center;
            padding: 2rem;
          }
          .error-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .error-message h3 {
            color: #ef4444;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
          }
          .error-message p {
            margin-bottom: 1.5rem;
            opacity: 0.8;
            font-size: 0.9rem;
          }
          .retry-button {
            background: #22c55e;
            border: none;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            cursor: pointer;
            font-weight: 500;
            transition: background 0.2s;
          }
          .retry-button:hover {
            background: #16a34a;
          }
        `}</style>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`code-editor-loading ${className}`}>
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading code editor...</p>
        </div>
        <style>{`
          .code-editor-loading {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #1e1e1e;
            color: #d4d4d4;
          }
          .loading-content {
            text-align: center;
          }
          .spinner {
            width: 2rem;
            height: 2rem;
            border: 2px solid #374151;
            border-top: 2px solid #22c55e;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .loading-content p {
            font-size: 0.9rem;
            opacity: 0.8;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`code-editor-container ${className}`}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default CodeEditor;