
import { useState, useCallback } from 'react';

const EXAMPLE_OUTPUT = `Hello, World!
Fibonacci: 0 1 1 2 3 5 8 13 21 34
Original: [1, 2, 3, 4, 5]
Sum: 15
Doubled: [2, 4, 6, 8, 10]

Process finished with exit code 0`;

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
