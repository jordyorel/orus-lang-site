
import { useState } from 'react';

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

const EXAMPLE_OUTPUT = `Hello, World!
Fibonacci: 0 1 1 2 3 5 8 13 21 34
Original: [1, 2, 3, 4, 5]
Sum: 15
Doubled: [2, 4, 6, 8, 10]

Process finished with exit code 0`;

export const usePlayground = () => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput(EXAMPLE_OUTPUT);
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setCode(`fn main() {
    println!("Hello, Orus!");
}`);
    setOutput('');
  };

  const shareCode = () => {
    navigator.clipboard.writeText(window.location.href + '?code=' + encodeURIComponent(code));
  };

  const exportCode = () => {
    // Export logic
  };

  const handleExampleSelect = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
  };

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
    handleExampleSelect
  };
};
