
import { Button } from '@/components/ui/button';
import { Play, Download, Share, RotateCcw, Copy, BookOpen } from 'lucide-react';
import { PlaygroundToolbarProps } from '@/types/playground';

const PlaygroundToolbar = ({ 
  isRunning, 
  onRun, 
  onReset, 
  onShare, 
  onExport 
}: PlaygroundToolbarProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-1.5 text-sm"
        >
          <Play size={14} className="mr-1.5" />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
        
        <div className="text-gray-400 text-sm">|</div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-sm px-3 py-1.5"
        >
          <Share size={14} className="mr-1.5" />
          Share
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onExport}
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-sm px-3 py-1.5"
        >
          <Copy size={14} className="mr-1.5" />
          Copy URL
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-sm px-3 py-1.5"
        >
          <BookOpen size={14} className="mr-1.5" />
          Help
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-sm px-3 py-1.5"
        >
          <RotateCcw size={14} className="mr-1.5" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default PlaygroundToolbar;
