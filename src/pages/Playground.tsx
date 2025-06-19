
import PlaygroundToolbar from '@/components/playground/PlaygroundToolbar';
import CodeEditor from '@/components/playground/CodeEditor';
import OutputPanel from '@/components/playground/OutputPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { usePlayground } from '@/hooks/usePlayground';
import { Toaster } from '@/components/ui/toaster';
import { useEffect, useState } from 'react';

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

  const [showOutputPanel, setShowOutputPanel] = useState(false);

  useEffect(() => {
    console.log('Playground component mounted');
    console.log('Code length:', code.length);
  }, [code]);

  useEffect(() => {
    // Show output panel when there's output or code is running
    setShowOutputPanel(isRunning || Boolean(output));
  }, [isRunning, output]);

  console.log('Playground rendering with code:', code.substring(0, 50) + '...');

  const handleDragUp = () => {
    setShowOutputPanel(true);
  };

  const handleCloseOutput = () => {
    setShowOutputPanel(false);
    clearOutput();
  };

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

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {showOutputPanel ? (
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Code Editor */}
            <ResizablePanel defaultSize={70} minSize={30}>
              <CodeEditor code={code} onChange={setCode} />
            </ResizablePanel>

            <ResizableHandle 
              withHandle 
              className="bg-charcoal-700 hover:bg-gold-500 transition-colors relative group"
              onDoubleClick={handleCloseOutput}
            >
              <div 
                className="absolute inset-0 cursor-ns-resize"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const startY = e.clientY;
                  let isDragging = false;
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaY = e.clientY - startY;
                    isDragging = true;
                    
                    // If dragged down more than 100px, close the panel
                    if (deltaY > 100) {
                      handleCloseOutput();
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    }
                  };
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  };
                  
                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                }}
              />
            </ResizableHandle>

            {/* Output Panel */}
            <ResizablePanel defaultSize={30} minSize={20}>
              <OutputPanel output={output} isRunning={isRunning} onClear={handleCloseOutput} />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="h-full relative">
            <CodeEditor code={code} onChange={setCode} />
            {/* Enhanced draggable handle at bottom */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-4 bg-charcoal-700 hover:bg-gold-500 cursor-ns-resize transition-colors group flex items-center justify-center"
              onMouseDown={(e) => {
                e.preventDefault();
                const startY = e.clientY;
                
                const handleMouseMove = (e: MouseEvent) => {
                  const deltaY = startY - e.clientY;
                  if (deltaY > 20) { // Dragged up at least 20px
                    handleDragUp();
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                  }
                };
                
                const handleMouseUp = () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };
                
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
            >
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-charcoal-400 group-hover:bg-gold-400 rounded-full transition-colors"></div>
                <div className="w-1 h-1 bg-charcoal-400 group-hover:bg-gold-400 rounded-full transition-colors"></div>
                <div className="w-1 h-1 bg-charcoal-400 group-hover:bg-gold-400 rounded-full transition-colors"></div>
                <div className="w-1 h-1 bg-charcoal-400 group-hover:bg-gold-400 rounded-full transition-colors"></div>
                <div className="w-1 h-1 bg-charcoal-400 group-hover:bg-gold-400 rounded-full transition-colors"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Toaster />
    </div>
  );
};

export default Playground;
