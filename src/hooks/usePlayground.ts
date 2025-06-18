import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

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
    setOutput(''); // Clear previous output
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
    toast({
      title: "Code Reset",
      description: "The playground has been reset to the default code.",
    });
  };

  const shareCode = async () => {
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}`;
      await navigator.clipboard.writeText(shareUrl);
      
      toast({
        title: "Share Link Created",
        description: "The playground URL has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Code Copied",
        description: "The code has been copied to your clipboard.",
      });
    } catch (error) {
      // Fallback: create downloadable file
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'main.rs';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Code Downloaded",
        description: "The code has been downloaded as main.rs file.",
      });
    }
  };

  const showHelp = () => {
    toast({
      title: "Orus Playground Help",
      description: "Use the examples on the left to get started. Click Run to execute your code. Use Share to copy a link or Copy URL to copy just the code.",
    });
  };

  const clearOutput = () => {
    setOutput('');
    toast({
      title: "Output Cleared",
      description: "The output panel has been cleared.",
    });
  };

  const handleExampleSelect = (exampleCode: string) => {
    setCode(exampleCode);
    setOutput('');
    toast({
      title: "Example Loaded",
      description: "The example code has been loaded into the editor.",
    });
  };

  // Load code from URL parameter on mount
  useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      try {
        const decodedCode = decodeURIComponent(codeParam);
        setCode(decodedCode);
      } catch (error) {
        console.error('Failed to decode code from URL:', error);
      }
    }
  });

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
