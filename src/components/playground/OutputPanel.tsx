
import { Card } from '@/components/ui/card';
import { Terminal } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';

const OutputPanel = ({ output, isRunning }: OutputPanelProps) => {
  return (
    <Card className="bg-charcoal-800/50 border-charcoal-700 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Terminal size={16} className="text-gold-400" />
        <span className="text-white font-medium">Output</span>
      </div>
      <div className="bg-charcoal-900 rounded-lg p-4 h-[600px] overflow-y-auto">
        {isRunning ? (
          <div className="text-gold-400 font-fira">
            <div className="animate-pulse">Compiling and running...</div>
          </div>
        ) : output ? (
          <pre className="text-charcoal-200 font-fira text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        ) : (
          <div className="text-charcoal-500 font-fira text-sm">
            Click "Run" to execute your code...
          </div>
        )}
      </div>
    </Card>
  );
};

export default OutputPanel;
