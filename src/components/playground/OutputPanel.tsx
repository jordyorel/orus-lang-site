
import { Terminal, X, Trash2 } from 'lucide-react';
import { OutputPanelProps } from '@/types/playground';
import { Button } from '@/components/ui/button';

const OutputPanel = ({ output, isRunning, onClear }: OutputPanelProps) => {
  // Function to convert ANSI color codes to HTML
  const formatOutput = (text: string) => {
    if (!text) return '';
    
    // ANSI color code mappings
    const ansiColors: Record<string, string> = {
      '[31m': 'text-red-400',      // red
      '[31;1m': 'text-red-400 font-bold',  // bold red
      '[32m': 'text-green-400',    // green
      '[32;1m': 'text-green-400 font-bold', // bold green
      '[33m': 'text-yellow-400',   // yellow
      '[33;1m': 'text-yellow-400 font-bold', // bold yellow
      '[34m': 'text-blue-400',     // blue
      '[34;1m': 'text-blue-400 font-bold',  // bold blue
      '[35m': 'text-purple-400',   // magenta
      '[35;1m': 'text-purple-400 font-bold', // bold magenta
      '[36m': 'text-cyan-400',     // cyan
      '[36;1m': 'text-cyan-400 font-bold',   // bold cyan
      '[37m': 'text-white',        // white
      '[37;1m': 'text-white font-bold',      // bold white
      '[0m': '',                   // reset
    };
    
    let result = text;
    
    // Replace ANSI codes with HTML spans
    Object.entries(ansiColors).forEach(([ansiCode, className]) => {
      if (className === '') {
        // For reset codes, close the span
        result = result.replace(new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '</span>');
      } else {
        // For color codes, open a span with the appropriate class
        result = result.replace(
          new RegExp(ansiCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 
          `<span class="${className}">`
        );
      }
    });
    
    // Clean up any unclosed spans and extra closing spans
    const openSpans = (result.match(/<span/g) || []).length;
    const closeSpans = (result.match(/<\/span>/g) || []).length;
    
    if (openSpans > closeSpans) {
      // Add missing closing spans
      result += '</span>'.repeat(openSpans - closeSpans);
    } else if (closeSpans > openSpans) {
      // Remove extra closing spans
      let extraCloses = closeSpans - openSpans;
      result = result.replace(/<\/span>/g, (match) => {
        if (extraCloses > 0) {
          extraCloses--;
          return '';
        }
        return match;
      });
    }
    
    return result;
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-900">
      {/* Tabs Header */}
      <div className="flex items-center justify-between bg-charcoal-800 border-b border-charcoal-700">
        <div className="flex">
          <button className="px-4 py-2 text-sm text-charcoal-200 bg-charcoal-700 border-r border-charcoal-600">
            Output
          </button>
        </div>
        <div className="flex items-center space-x-2 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-charcoal-400 hover:text-charcoal-200 p-2"
            title="Clear output"
          >
            <Trash2 size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="text-charcoal-400 hover:text-charcoal-200 p-2"
            title="Close panel"
          >
            <X size={16} />
          </Button>
        </div>
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
            <pre 
              className="text-charcoal-200 font-mono text-sm leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: formatOutput(output)
              }}
            />
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
