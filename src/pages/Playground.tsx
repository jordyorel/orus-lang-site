
import PlaygroundHeader from '@/components/playground/PlaygroundHeader';
import PlaygroundSidebar from '@/components/playground/PlaygroundSidebar';
import PlaygroundContent from '@/components/playground/PlaygroundContent';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlayground } from '@/hooks/usePlayground';
import { playgroundExamples } from '@/data/playgroundExamples';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

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
    showHelp,
    clearOutput,
    handleExampleSelect
  } = usePlayground();

  useEffect(() => {
    console.log('Playground component mounted');
    console.log('Code length:', code.length);
    console.log('Examples count:', playgroundExamples.length);
  }, [code]);

  return (
    <div className="h-screen bg-charcoal-950 flex flex-col">
      {/* Header */}
      <div className="bg-charcoal-900 text-white px-4 py-2 border-b border-charcoal-800">
        <div className="flex items-center justify-between">
          <PlaygroundHeader />
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-charcoal-300 hover:text-white hover:bg-charcoal-700">
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
            onHelp={showHelp}
            onClearOutput={clearOutput}
          />
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Playground;
