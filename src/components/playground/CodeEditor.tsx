
import MonacoEditor from '@/components/MonacoEditor';
import ErrorBoundary from '@/components/ErrorBoundary';
import { CodeEditorProps } from '@/types/playground';

const CodeEditor = ({ code, onChange }: CodeEditorProps) => {
  console.log('CodeEditor rendering with code length:', code.length);

  return (
    <div className="h-full bg-charcoal-900">
      <ErrorBoundary>
        <MonacoEditor
          value={code}
          onChange={onChange}
          language="orus"
          height="100%"
          forceDarkMode={true}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CodeEditor;
