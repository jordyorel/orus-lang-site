
import { Terminal, X } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';
import { Button } from '@/components/ui/button';

const OutputPanel = ({ output, isRunning }: OutputPanelProps) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-charcoal-900">
      <div className="flex items-center justify-between px-4 py-2 border-b border-charcoal-300 dark:border-charcoal-600 bg-charcoal-50 dark:bg-charcoal-800 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Terminal size={14} className="text-charcoal-600 dark:text-charcoal-400" />
          <span className="text-sm font-medium text-charcoal-700 dark:text-charcoal-300">Output</span>
        </div>
        <Button variant="ghost" size="sm" className="text-charcoal-500 hover:text-charcoal-700 dark:text-charcoal-400 dark:hover:text-charcoal-200 p-1">
          <X size={14} />
        </Button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {isRunning ? (
          <div className="text-charcoal-600 dark:text-charcoal-400 font-mono text-sm">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-600 mr-2"></div>
              Compiling and running...
            </div>
          </div>
        ) : output ? (
          <pre className="text-charcoal-800 dark:text-charcoal-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {output}
          </pre>
        ) : (
          <div className="text-charcoal-500 dark:text-charcoal-400 font-mono text-sm">
            Program output will appear here...
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
