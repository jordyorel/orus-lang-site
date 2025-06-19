
import { useState, useCallback } from 'react';

const EXAMPLE_OUTPUT = `Hello`;

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = useCallback(async () => {
    setIsRunning(true);
    setOutput('');
    
    // Faster simulation
    setTimeout(() => {
      setOutput(EXAMPLE_OUTPUT);
      setIsRunning(false);
    }, 800);
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
