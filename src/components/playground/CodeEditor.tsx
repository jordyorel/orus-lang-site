
import { Card } from '@/components/ui/card';
import MonacoEditor from '@/components/MonacoEditor';
import { Terminal } from 'lucide-react';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <div className="h-full flex flex-col bg-charcoal-800/30">
      <div className="flex items-center space-x-2 p-4 border-b border-charcoal-700/50">
        <Terminal size={16} className="text-gold-400" />
        <span className="text-white font-medium">Code Editor</span>
      </div>
      <div className="flex-1 p-4">
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
