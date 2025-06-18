
import PlaygroundToolbar from './PlaygroundToolbar';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface PlaygroundContentProps {
  code: string;
  onChange: (code: string) => void;
  output: string;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
  onShare: () => void;
  onExport: () => void;
}

const PlaygroundContent = ({
  code,
  onChange,
  output,
  isRunning,
  onRun,
  onReset,
  onShare,
  onExport
}: PlaygroundContentProps) => {
  return (
    <>
      {/* Toolbar */}
      <div className="bg-charcoal-100 dark:bg-charcoal-800 border-b border-charcoal-300 dark:border-charcoal-600 px-4 py-2">
        <PlaygroundToolbar
          isRunning={isRunning}
          onRun={onRun}
          onReset={onReset}
          onShare={onShare}
          onExport={onExport}
        />
      </div>

      {/* Editor and Output Area */}
      <div className="flex-1 min-w-0">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Code Editor */}
          <ResizablePanel defaultSize={60} minSize={30}>
            <CodeEditor code={code} onChange={onChange} />
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-charcoal-300 dark:bg-charcoal-600 hover:bg-gold-400 dark:hover:bg-gold-500 transition-colors" />

          {/* Output Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <OutputPanel output={output} isRunning={isRunning} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
};

export default PlaygroundContent;
