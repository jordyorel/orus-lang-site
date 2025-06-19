
import PlaygroundHeader from '@/components/playground/PlaygroundHeader';
import PlaygroundToolbar from '@/components/playground/PlaygroundToolbar';
import CodeEditor from '@/components/playground/CodeEditor';
import OutputPanel from '@/components/playground/OutputPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePlayground } from '@/hooks/usePlayground';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';

const Playground = () => {
  console.log('Playground component is rendering');
  
  const {
    code,
    setCode,
    output,
    isRunning,
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
  }, [code]);

  console.log('Playground rendering with code:', code.substring(0, 50) + '...');

  const showOutputPanel = isRunning || output;

  return (
    <div className="h-screen bg-charcoal-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-charcoal-800 border-b border-charcoal-700 px-4 py-2">
        <PlaygroundToolbar
          isRunning={isRunning}
          onRun={runCode}
          onReset={resetCode}
          onShare={shareCode}
          onExport={exportCode}
          onHelp={showHelp}
        />
      </div>

      {/* Main Content Area with Resizable Panels */}
      <div className="flex-1 min-h-0">
        {showOutputPanel ? (
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Code Editor */}
            <ResizablePanel defaultSize={70} minSize={30}>
              <CodeEditor code={code} onChange={setCode} />
            </ResizablePanel>

            <ResizableHandle withHandle className="bg-charcoal-700 hover:bg-gold-500 transition-colors" />

            {/* Output Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <OutputPanel output={output} isRunning={isRunning} onClear={clearOutput} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          /* Full Code Editor when no output */
          <CodeEditor code={code} onChange={setCode} />
        )}
      </div>
      
      <Toaster />
    </div>
  );
};

export default Playground;
