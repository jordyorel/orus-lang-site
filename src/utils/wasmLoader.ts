
// Direct usage of the compiled Orus WASM module
declare global {
  interface Window {
    Module: any;
    createOrusModule?: () => Promise<any>;
    OrusModule?: any;
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
      script.onload = async () => {
        try {
          // Wait a bit for the module to initialize
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try different ways the module might be exposed
          if (window.Module) {
            wasmModule = window.Module;
            console.log('Orus WASM module loaded successfully via window.Module');
            resolve();
          } else if (window.createOrusModule) {
            wasmModule = await window.createOrusModule();
            console.log('Orus WASM module loaded successfully via createOrusModule');
            resolve();
          } else if (window.OrusModule) {
            wasmModule = window.OrusModule;
            console.log('Orus WASM module loaded successfully via window.OrusModule');
            resolve();
          } else {
            // Log all available properties to help debug
            console.log('Available window properties:', Object.keys(window).filter(key => key.toLowerCase().includes('module') || key.toLowerCase().includes('orus')));
            reject(new Error('Module not found after loading script. Check console for available properties.'));
          }
        } catch (error) {
          reject(new Error(`Failed to initialize module: ${error}`));
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
    } else if (typeof wasmModule.ccall === 'function') {
      // Try using Emscripten's ccall function
      return wasmModule.ccall('main', 'string', ['string'], [code]);
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
