
import MonacoEditor from '@/components/MonacoEditor';
import { Terminal } from 'lucide-react';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col bg-charcoal-800/30">
      <div className="flex items-center space-x-2 p-3 border-b border-charcoal-700/50 flex-shrink-0">
        <Terminal size={16} className="text-gold-400" />
        <span className="text-white font-medium">Code Editor</span>
      </div>
      <div className="flex-1 p-3 min-h-0">
        <div className="h-full">
          <MonacoEditor
            value={code}
            onChange={onChange}
            language="orus"
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
