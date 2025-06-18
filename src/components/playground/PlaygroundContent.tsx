
import PlaygroundToolbar from './PlaygroundToolbar';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';

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
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
        <PlaygroundToolbar
          isRunning={isRunning}
          onRun={onRun}
          onReset={onReset}
          onShare={onShare}
          onExport={onExport}
        />
      </div>

      {/* Editor and Output Area */}
      <div className="flex-1 flex min-w-0">
        {/* Code Editor */}
        <div className="flex-1 border-r border-gray-300 min-w-0">
          <CodeEditor code={code} onChange={onChange} />
        </div>

        {/* Output Panel */}
        <div className="flex-1 min-w-0">
          <OutputPanel output={output} isRunning={isRunning} />
        </div>
      </div>
    </>
  );
};

export default PlaygroundContent;
