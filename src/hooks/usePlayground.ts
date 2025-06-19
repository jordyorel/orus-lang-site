
import { useState } from 'react';
import { useUrlCodeLoader } from './useUrlCodeLoader';
import { useCodeExecution } from './useCodeExecution';
import { usePlaygroundActions } from './usePlaygroundActions';

const DEFAULT_CODE = `fn main() {
    println!("Hello");
}`;

export const usePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);

  // Load code from URL parameter on mount
  useUrlCodeLoader(setCode);

  // Code execution functionality
  const { output, isRunning, runCode, clearOutput } = useCodeExecution();

  // Playground actions (reset, share, export, etc.)
  const {
    resetCode,
    shareCode,
    exportCode,
    showHelp,
    handleExampleSelect
  } = usePlaygroundActions(code, setCode, () => clearOutput());

  return {
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
  };
};
