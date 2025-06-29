// usePlayground.ts: State management and code execution
import { useState, useCallback, useRef, useEffect } from 'react';
import { runOrusCode } from '@/utils/wasmLoader';

interface OutputLine {
  id: string;
  content: string;
  type: 'normal' | 'error' | 'info' | 'success' | 'warning';
  timestamp: Date;
}

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
  isActive: boolean;
}

interface PlaygroundState {
  files: FileTab[];
  activeFileId: string;
  output: OutputLine[];
  isRunning: boolean;
  isRuntimeReady: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
}

export const usePlayground = () => {
  const [state, setState] = useState<PlaygroundState>({
    files: [
      {
        id: 'main-orus',
        name: 'main.orus',
        content: `struct DynamicProgramming {}

impl DynamicProgramming {
    // Fibonacci using dynamic programming (memoization)
    fn fibonacci_dp(n: i32) -> i32 {
        // Base cases
        if n <= (0 as i32) {
            return 0 as i32
        }
        if n == (1 as i32) {
            return 1 as i32
        }
        
        // Create an array for memoization
        let mut fib: [i32; 30] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        
        // Fill the array bottom-up
        let mut i: i32 = 2
        while i <= n {
            fib[i] = fib[i - (1 as i32)] + fib[i - (2 as i32)]
            i = i + (1 as i32)
        }
        
        return fib[n]
    }
    
    // Simple coin change problem for making 31 cents with [1,5,10,25]
    fn coin_change_simple() -> i32 {
        // The minimum coins for 31 cents: 25 + 5 + 1
        return 3 as i32
    }
    
    // Longest Increasing Subsequence length - simplified
    fn lis_example() -> i32 {
        // For sequence [10, 22, 9, 33, 21, 50, 41, 60, 80, 1]
        // LIS is [10, 22, 33, 50, 60, 80] of length 6
        return 6 as i32
    }
}

fn main() {
    // Test Fibonacci DP
    print("Fibonacci DP Examples:")
    let fib10: i32 = DynamicProgramming.fibonacci_dp(10 as i32)
    let fib15: i32 = DynamicProgramming.fibonacci_dp(15 as i32)
    print("Fibonacci(10) = {}", fib10)  // 55
    print("Fibonacci(15) = {}", fib15)  // 610
    
    // Test Coin Change
    print("\\nCoin Change Example:")
    let change_for_31: i32 = DynamicProgramming.coin_change_simple()
    print("Minimum coins for 31 cents: {}", change_for_31)  // 3: 25 + 5 + 1 = 31
    
    // Test Longest Increasing Subsequence
    print("\\nLongest Increasing Subsequence Example:")
    print("Sequence: [10, 22, 9, 33, 21, 50, 41, 60, 80, 1]")
    print("Length of longest increasing subsequence: {}", DynamicProgramming.lis_example())  // 6
}`,
        language: 'orus',
        isActive: true
      }
    ],
    activeFileId: 'main-orus',
    output: [],
    isRunning: false,
    isRuntimeReady: false,
    isSaving: false,
    lastSaved: null
  });

  const runtimeRef = useRef<any>(null);
  const outputIdCounter = useRef(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save files to localStorage when they change
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setState(prev => ({ ...prev, isSaving: true }));

    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('orus-playground-files', JSON.stringify(state.files));
        setState(prev => ({ 
          ...prev, 
          isSaving: false, 
          lastSaved: new Date() 
        }));
      } catch (error) {
        console.warn('Failed to save files:', error);
        setState(prev => ({ ...prev, isSaving: false }));
      }
    }, 1000); // Debounce save by 1 second

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.files]);

  // Load saved files from localStorage on initialization
  useEffect(() => {
    try {
      const savedFiles = localStorage.getItem('orus-playground-files');
      if (savedFiles) {
        const files = JSON.parse(savedFiles);
        if (files.length > 0) {
          setState(prev => ({
            ...prev,
            files,
            activeFileId: files[0].id,
            lastSaved: new Date()
          }));
        }
      }
    } catch (error) {
      console.warn('Failed to load saved files:', error);
    }
  }, []);

  // Initialize runtime (real Orus WASM)
  useEffect(() => {
    initializeRuntime();
  }, []);

  const initializeRuntime = async () => {
    try {
      addOutput('🔄 Initializing Orus WASM runtime...', 'info');
      
      // Initialize the real Orus WASM runtime
      await runOrusCode('// Runtime initialization test');
      
      runtimeRef.current = {
        execute: (code: string) => {
          return runOrusCode(code);
        }
      };

      setState(prev => ({ ...prev, isRuntimeReady: true }));
      addOutput('✅ Orus WASM runtime ready!', 'success');
      
    } catch (error) {
      addOutput(`❌ Failed to initialize WASM runtime: ${error}`, 'error');
      console.error('WASM initialization error:', error);
    }
  };


  const addOutput = useCallback((content: string, type: OutputLine['type'] = 'normal') => {
    const newOutput: OutputLine = {
      id: `output-${++outputIdCounter.current}`,
      content,
      type,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      output: [...prev.output, newOutput]
    }));
  }, []);

  const clearOutput = useCallback(() => {
    setState(prev => ({
      ...prev,
      output: []
    }));
    addOutput('Output cleared. Ready for execution.', 'info');
  }, [addOutput]);

  const runCode = useCallback(async () => {
    if (!runtimeRef.current || state.isRunning) return;

    const activeFile = state.files.find(f => f.id === state.activeFileId);
    if (!activeFile || !activeFile.content.trim()) {
      addOutput('⚠️ No code to execute', 'warning');
      return;
    }

    if (!state.isRuntimeReady) {
      addOutput('⚠️ WASM runtime is not ready yet. Please wait...', 'warning');
      return;
    }

    setState(prev => ({ ...prev, isRunning: true }));
    const startTime = performance.now();

    try {
      const result = await runtimeRef.current.execute(activeFile.content);
      const elapsedTime = ((performance.now() - startTime) / 1000).toFixed(2);
      addOutput(`✅ Executed in ${elapsedTime}s`, 'success');
      
      if (result && result.trim()) {
        // Handle multi-line output
        const lines = result.split('\n');
        lines.forEach((line: string) => {
          if (line.trim()) {
            // Check if line contains an error
            if (line.toLowerCase().includes('error') || line.toLowerCase().includes('exception')) {
              addOutput(line, 'error');
            } else {
              addOutput(line, 'normal');
            }
          }
        });
      } else {
        addOutput('✅ Code compiled and executed successfully (no output)', 'success');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addOutput(`❌ WASM Execution Error: ${errorMessage}`, 'error');
      console.error('WASM execution error:', error);
    } finally {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  }, [state.isRunning, state.activeFileId, state.files, state.isRuntimeReady, addOutput]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.id === fileId 
          ? { ...file, content }
          : file
      )
    }));
  }, []);

  const setActiveFile = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      activeFileId: fileId,
      files: prev.files.map(file => ({
        ...file,
        isActive: file.id === fileId
      }))
    }));
  }, []);

  const addNewFile = useCallback((name: string, language: string = 'orus') => {
    const newFile: FileTab = {
      id: `file-${Date.now()}`,
      name,
      content: language === 'orus' ? '// New Orus file\nfn main() {\n    print("Hello, Orus!")\n}' : '',
      language,
      isActive: true
    };

    setState(prev => ({
      ...prev,
      files: prev.files.map(file => ({ ...file, isActive: false })).concat(newFile),
      activeFileId: newFile.id
    }));

    return newFile.id;
  }, []);

  const closeFile = useCallback((fileId: string) => {
    setState(prev => {
      const remainingFiles = prev.files.filter(f => f.id !== fileId);
      if (remainingFiles.length === 0) {
        // Don't allow closing the last file
        return prev;
      }

      let newActiveId = prev.activeFileId;
      if (prev.activeFileId === fileId) {
        newActiveId = remainingFiles[0].id;
      }

      return {
        ...prev,
        files: remainingFiles.map(file => ({
          ...file,
          isActive: file.id === newActiveId
        })),
        activeFileId: newActiveId
      };
    });
  }, []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.map(file => 
        file.id === fileId 
          ? { ...file, name: newName }
          : file
      )
    }));
  }, []);

  const formatCode = useCallback((fileId: string) => {
    // Simple formatting for Orus code
    const file = state.files.find(f => f.id === fileId);
    if (!file) return;

    const formatted = file.content
      .split('\n')
      .map(line => line.trim())
      .join('\n')
      .replace(/\{\s*\n/g, ' {\n')
      .replace(/\n\s*\}/g, '\n}');

    updateFileContent(fileId, formatted);
    addOutput('✨ Code formatted', 'success');
  }, [state.files, updateFileContent, addOutput]);

  // Computed values
  const activeFile = state.files.find(f => f.id === state.activeFileId);

  return {
    // State
    files: state.files,
    activeFile,
    output: state.output,
    isRunning: state.isRunning,
    isRuntimeReady: state.isRuntimeReady,
    isSaving: state.isSaving,
    lastSaved: state.lastSaved,

    // Actions
    runCode,
    clearOutput,
    updateFileContent,
    setActiveFile,
    addNewFile,
    closeFile,
    renameFile,
    formatCode,
    addOutput
  };
};