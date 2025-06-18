
import { Terminal, X } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';
import { Button } from '@/components/ui/button';

const OutputPanel = ({ output, isRunning }: OutputPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300 bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Output</span>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 p-1">
          <X size={14} />
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {isRunning ? (
          <div className="text-gray-600 font-mono text-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
              Compiling and running...
            </div>
          </div>
        ) : output ? (
          <pre className="text-gray-800 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        ) : (
          <div className="text-gray-500 font-mono text-sm">
            Program output will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
