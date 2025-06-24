
import { Terminal, X } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';
import { Button } from '@/components/ui/button';

const OutputPanel = ({ output, isRunning, onClear }: OutputPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-charcoal-900">
      {/* Tabs Header */}
      <div className="flex items-center justify-between bg-charcoal-800 border-b border-charcoal-700">
        <div className="flex">
          <button className="px-4 py-2 text-sm text-charcoal-200 bg-charcoal-700 border-r border-charcoal-600">
            Output
          </button>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="text-charcoal-400 hover:text-charcoal-200 p-2 mr-2"
        >
          Close
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-charcoal-950">
        <div className="p-4 h-full overflow-y-auto">
          {isRunning ? (
            <div className="text-charcoal-400 font-mono text-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-600 mr-2"></div>
                Running...
              </div>
            </div>
          ) : output ? (
            <pre className="text-charcoal-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {output}
            </pre>
          ) : (
            <div className="text-charcoal-400 font-mono text-sm">
              Program output will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
