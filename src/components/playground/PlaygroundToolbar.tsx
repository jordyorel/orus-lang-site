
import { Button } from '@/components/ui/button';
import { Play, Download, Share, RotateCcw } from 'lucide-react';
import { PlaygroundToolbarProps } from '@/types/playground';

const PlaygroundToolbar = ({ 
  isRunning, 
  onRun, 
  onReset, 
  onShare, 
  onExport 
}: PlaygroundToolbarProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-gold-500 hover:bg-gold-600 text-charcoal-950 font-semibold"
        >
          <Play size={16} className="mr-2" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="border-charcoal-600 text-charcoal-300 hover:text-gold-400 hover:border-gold-500/50"
        >
          <RotateCcw size={16} className="mr-2" />
          Reset
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-charcoal-400 hover:text-gold-400"
        >
          <Share size={16} className="mr-2" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="text-charcoal-400 hover:text-gold-400"
        >
          <Download size={16} className="mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
