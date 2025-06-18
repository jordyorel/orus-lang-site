
import { Terminal } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';

const OutputPanel = ({ output, isRunning }: OutputPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-charcoal-800/30">
      <div className="flex items-center space-x-2 p-4 border-b border-charcoal-700/50">
        <Terminal size={16} className="text-gold-400" />
        <span className="text-white font-medium">Output</span>
      </div>
      <div className="flex-1 p-4">
        <div className="bg-charcoal-900 rounded-lg p-4 h-full overflow-y-auto">
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
      </div>
    </div>
  );
};

export default OutputPanel;
