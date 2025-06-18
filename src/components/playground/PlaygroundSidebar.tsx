
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExamplesSidebar from './ExamplesSidebar';
import { CodeExample } from '@/types/playground';

interface PlaygroundSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  examples: CodeExample[];
  onExampleSelect: (code: string) => void;
}

const PlaygroundSidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  examples, 
  onExampleSelect 
}: PlaygroundSidebarProps) => {
  return (
    <>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-gray-300 flex-shrink-0 bg-gray-50`}>
        <div className="h-full p-4">
          <ExamplesSidebar 
            examples={examples} 
            onExampleSelect={onExampleSelect} 
          />
        </div>
      </div>

      {/* Sidebar Toggle */}
      <div className="flex flex-col justify-center flex-shrink-0 bg-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-12 w-8 rounded-none border-y border-r border-gray-300 text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </Button>
      </div>
    </>
  );
};

export default PlaygroundSidebar;
