
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
            Execution
          </button>
          <button className="px-4 py-2 text-sm text-charcoal-400 hover:text-charcoal-200 hover:bg-charcoal-700">
            Standard Error
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
              <div className="mb-2">Compiling playground v0.0.1 (/playground)</div>
              <div className="mb-2">Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.73s</div>
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-600 mr-2"></div>
                Running `target/debug/playground`
              </div>
            </div>
          ) : output ? (
            <div>
              <div className="text-charcoal-400 font-mono text-sm mb-4">
                <div>Compiling playground v0.0.1 (/playground)</div>
                <div>Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.73s</div>
                <div>Running `target/debug/playground`</div>
              </div>
              <div className="border-t border-charcoal-700 pt-4">
                <div className="text-sm font-medium text-charcoal-300 mb-2">Standard Output</div>
                <pre className="text-charcoal-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
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
