
import { Card } from '@/components/ui/card';
import MonacoEditor from '@/components/MonacoEditor';
import { Terminal } from 'lucide-react';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  return (
    <Card className="bg-charcoal-800/50 border-charcoal-700 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Terminal size={16} className="text-gold-400" />
        <span className="text-white font-medium">Code Editor</span>
      </div>
      <MonacoEditor
        value={code}
        onChange={onChange}
        language="orus"
        height="600px"
      />
    </Card>
  );
};

export default CodeEditor;
