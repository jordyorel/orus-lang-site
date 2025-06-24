
// Simple direct usage of the compiled Orus WASM module
declare global {
  interface Window {
    Module: any;
  }
}

let wasmModule: any = null;

export const initializeWasm = async (): Promise<void> => {
  if (wasmModule) return;

  try {
    // Load the compiled JavaScript file
    const script = document.createElement('script');
    script.src = '/orus-web.js';
    
    return new Promise((resolve, reject) => {
      script.onload = () => {
        // The compiled JS should set up window.Module
        if (window.Module) {
          wasmModule = window.Module;
          console.log('Orus WASM module loaded successfully');
          resolve();
        } else {
          reject(new Error('Module not found after loading script'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load orus-web.js'));
      };
      
      document.head.appendChild(script);
    });
  } catch (error) {
    console.error('Failed to initialize WASM:', error);
    throw new Error(`Failed to load Orus WASM: ${error}`);
  }
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    await initializeWasm();
    
    if (!wasmModule) {
      throw new Error('WASM module not initialized');
    }

    // Use the module's function to run Orus code
    // The exact function name may vary based on your compilation
    if (typeof wasmModule.runCode === 'function') {
      return wasmModule.runCode(code);
    } else if (typeof wasmModule.run === 'function') {
      return wasmModule.run(code);
    } else if (typeof wasmModule.execute === 'function') {
      return wasmModule.execute(code);
    } else {
      // Log available functions for debugging
      console.log('Available module functions:', Object.keys(wasmModule));
      throw new Error('No suitable execution function found in WASM module');
    }
  } catch (error) {
    console.error('Error running Orus code:', error);
    throw error;
  }
};
