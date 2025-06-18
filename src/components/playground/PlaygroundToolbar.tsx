
import { Button } from '@/components/ui/button';
import { Play, Download, Share, RotateCcw, Copy, BookOpen } from 'lucide-react';
import { PlaygroundToolbarProps } from '@/types/playground';

const PlaygroundToolbar = ({ 
  isRunning, 
  onRun, 
  onReset, 
  onShare, 
  onExport,
  onHelp
}: PlaygroundToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-gold-600 hover:bg-gold-700 text-charcoal-900 font-medium px-4 py-1.5 text-sm"
        >
          <Play size={14} className="mr-1.5" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
        
        <div className="text-charcoal-500 text-sm">|</div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          <Share size={14} className="mr-1.5" />
          Share
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          <Copy size={14} className="mr-1.5" />
          Copy URL
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onHelp}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          <BookOpen size={14} className="mr-1.5" />
          Help
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-charcoal-300 hover:text-charcoal-100 hover:bg-charcoal-700 text-sm px-3 py-1.5"
        >
          <RotateCcw size={14} className="mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
