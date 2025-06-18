
export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export interface PlaygroundToolbarProps {
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
  onShare: () => void;
  onExport: () => void;
}

export interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export interface OutputPanelProps {
  output: string;
  isRunning: boolean;
}

export interface ExamplesSidebarProps {
  examples: CodeExample[];
  onExampleSelect: (code: string) => void;
}
