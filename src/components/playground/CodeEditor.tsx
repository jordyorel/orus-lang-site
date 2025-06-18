
import MonacoEditor from '@/components/MonacoEditor';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-300 bg-charcoal-50 flex-shrink-0">
        <span className="text-sm font-medium text-charcoal-700">src/main.rs</span>
        <div className="text-xs text-charcoal-500">
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
