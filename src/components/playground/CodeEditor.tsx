
import MonacoEditor from '@/components/MonacoEditor';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-charcoal-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-300 dark:border-charcoal-600 bg-charcoal-50 dark:bg-charcoal-800 flex-shrink-0">
        <span className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">src/main.rs</span>
        <div className="text-xs text-charcoal-500 dark:text-charcoal-400">
          {code.split('\n').length} lines
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <MonacoEditor
          value={code}
          onChange={onChange}
          language="orus"
          height="100%"
        />
      </div>
    </div>
  );
};

export default CodeEditor;
