
import MonacoEditor from '@/components/MonacoEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col bg-charcoal-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-600 bg-charcoal-800 flex-shrink-0">
        <span className="text-sm font-medium text-charcoal-300">src/main.rs</span>
        <div className="text-xs text-charcoal-400">
          {code.split('\n').length} lines
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <ErrorBoundary>
          <MonacoEditor
            value={code}
            onChange={onChange}
            language="orus"
            height="100%"
            forceDarkMode={true}
          />
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default CodeEditor;
