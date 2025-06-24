
import { useState, useCallback } from 'react';
import { runOrusCode } from '@/utils/wasmLoader';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async (code: string) => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Use the real Orus WASM compiler
      const result = await runOrusCode(code);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
  }, []);

  return {
    output,
    isRunning,
    runCode,
    clearOutput
  };
};
