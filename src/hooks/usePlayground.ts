
import { useState } from 'react';
import { useUrlCodeLoader } from './useUrlCodeLoader';
import { useCodeExecution } from './useCodeExecution';
import { usePlaygroundActions } from './usePlaygroundActions';

const DEFAULT_CODE = `fn main() {
    let name = "World";
    println!("Hello, {}!", name);
    
    // Fibonacci sequence
    let mut a = 0;
    let mut b = 1;
    
    print!("Fibonacci: {} {}", a, b);
    
    for _ in 0..8 {
        let temp = a + b;
        a = b;
        b = temp;
        print!(" {}", b);
    }
    
    println!();
    
    // Vector operations
    let numbers = vec![1, 2, 3, 4, 5];
    let sum: i32 = numbers.iter().sum();
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    
    println!("Original: {:?}", numbers);
    println!("Sum: {}", sum);
    println!("Doubled: {:?}", doubled);
}`;

export const usePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    sidebarOpen,
    setSidebarOpen,
    runCode,
    resetCode,
    shareCode,
    exportCode,
    showHelp,
    clearOutput,
    handleExampleSelect
  };
};
