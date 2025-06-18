
import PlaygroundHeader from '@/components/playground/PlaygroundHeader';
import PlaygroundSidebar from '@/components/playground/PlaygroundSidebar';
import PlaygroundContent from '@/components/playground/PlaygroundContent';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayground } from '@/hooks/usePlayground';
import { playgroundExamples } from '@/data/playgroundExamples';

const Playground = () => {
  const {
    code,
    setCode,
    output,
    isRunning,
    sidebarOpen,
    setSidebarOpen,
    runCode,
    resetCode,
    shareCode,
    exportCode,
    handleExampleSelect
  } = usePlayground();

  return (
    <div className="h-screen bg-white flex flex-col">
      {/* Header - Rust playground style */}
      <div className="bg-gray-800 text-white px-4 py-2 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <PlaygroundHeader />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Settings size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <PlaygroundSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          examples={playgroundExamples}
          onExampleSelect={handleExampleSelect}
        />

        {/* Editor and Output Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <PlaygroundContent
            code={code}
            onChange={setCode}
            output={output}
            isRunning={isRunning}
            onRun={runCode}
            onReset={resetCode}
            onShare={shareCode}
            onExport={exportCode}
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
