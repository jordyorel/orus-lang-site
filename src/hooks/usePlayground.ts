
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { sanitizeUrlParameter, secureClipboardWrite } from '@/utils/security';

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
  console.log('usePlayground hook initializing');
  
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load code from URL parameter on mount with security validation
  useEffect(() => {
    console.log('usePlayground: Checking URL parameters');
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      console.log('usePlayground: Found code parameter');
      const sanitizedCode = sanitizeUrlParameter(codeParam);
      if (sanitizedCode) {
        setCode(sanitizedCode);
        toast({
          title: "Code Loaded",
          description: "Code has been loaded from the URL.",
        });
      } else {
        toast({
          title: "Invalid URL Parameter",
          description: "The code parameter in the URL is invalid and was ignored.",
          variant: "destructive",
        });
      }
    }
  }, []);

  const runCode = async () => {
    console.log('usePlayground: Running code');
    setIsRunning(true);
    setOutput(''); // Clear previous output
    
    try {
      // Simulate code execution
      setTimeout(() => {
        console.log('usePlayground: Code execution completed');
        setOutput(EXAMPLE_OUTPUT);
        setIsRunning(false);
      }, 1500);
    } catch (error) {
      console.error('usePlayground: Code execution error:', error);
      setIsRunning(false);
      setOutput('Error: Failed to execute code');
      toast({
        title: "Execution Error",
        description: "An error occurred while running the code.",
        variant: "destructive",
      });
    }
  };

  const resetCode = () => {
    console.log('usePlayground: Resetting code');
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
    console.log('usePlayground: Sharing code');
    try {
      const shareUrl = `${window.location.origin}${window.location.pathname}?code=${encodeURIComponent(code)}`;
      const success = await secureClipboardWrite(shareUrl);
      
      if (success) {
        toast({
          title: "Share Link Created",
          description: "The playground URL has been copied to your clipboard.",
        });
      } else {
        throw new Error('Clipboard write failed');
      }
    } catch (error) {
      console.error('usePlayground: Share error:', error);
      toast({
        title: "Share Failed",
        description: "Failed to create share link. Please try copying the URL manually.",
        variant: "destructive",
      });
    }
  };

  const exportCode = async () => {
    console.log('usePlayground: Exporting code');
    try {
      const success = await secureClipboardWrite(code);
      
      if (success) {
        toast({
          title: "Code Copied",
          description: "The code has been copied to your clipboard.",
        });
      } else {
        // Fallback: create downloadable file
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.rs';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Code Downloaded",
          description: "The code has been downloaded as main.rs file.",
        });
      }
    } catch (error) {
      console.error('usePlayground: Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showHelp = () => {
    console.log('usePlayground: Showing help');
    toast({
      title: "Orus Playground Help",
      description: "Use the examples on the left to get started. Click Run to execute your code. Use Share to copy a link or Copy URL to copy just the code.",
    });
  };

  const clearOutput = () => {
    console.log('usePlayground: Clearing output');
    setOutput('');
    toast({
      title: "Output Cleared",
      description: "The output panel has been cleared.",
    });
  };

  const handleExampleSelect = (exampleCode: string) => {
    console.log('usePlayground: Example selected');
    setCode(exampleCode);
    setOutput('');
    toast({
      title: "Example Loaded",
      description: "The example code has been loaded into the editor.",
    });
  };

  console.log('usePlayground: Hook state - code length:', code.length, 'isRunning:', isRunning);

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
