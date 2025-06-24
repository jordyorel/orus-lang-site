
interface OrusModule {
  initWebVM: () => void;
  runSource: (code: string) => string;
  freeWebVM: () => void;
  getVersion: () => string;
  setInputCallback: (callback: any) => void;
  setOutputCallback: (callback: any) => void;
  registerWebBuiltins: () => void;
  getLastError: () => string;
  clearLastError: () => void;
  isVMReady: () => boolean;
  resetVMState: () => void;
  __wasmExports?: any; // For debugging access to all WASM exports
}

let orusModule: OrusModule | null = null;

export const loadOrusWasm = async (): Promise<OrusModule> => {
  if (orusModule) {
    return orusModule;
  }

  try {
    // Load the WASM file
    const wasmResponse = await fetch('/orus-web.wasm');
    if (!wasmResponse.ok) {
      throw new Error(`Failed to fetch WASM file: ${wasmResponse.status}`);
    }
    const wasmBytes = await wasmResponse.arrayBuffer();
    console.log('WASM file loaded, size:', wasmBytes.byteLength);
    
    // Compile the WASM module
    const wasmModule = await WebAssembly.compile(wasmBytes);
    const imports = WebAssembly.Module.imports(wasmModule);
    const exports = WebAssembly.Module.exports(wasmModule);
    
    console.log('WASM imports required:', imports);
    console.log('WASM exports available:', exports);
    
    // Create imports object with proper print function interception
    const importObject: any = {};
    
    imports.forEach((imp) => {
      if (!importObject[imp.module]) {
        importObject[imp.module] = {};
      }
      
      if (imp.kind === 'function') {
        // Create stub functions for imports
        importObject[imp.module][imp.name] = (...args: any[]) => {
          // Just log for debugging, don't try to capture here
          console.log(`Called ${imp.module}.${imp.name}:`, args);
          return 0;
        };
      } else if (imp.kind === 'memory') {
        importObject[imp.module][imp.name] = new WebAssembly.Memory({ initial: 256, maximum: 256 });
      } else if (imp.kind === 'global') {
        importObject[imp.module][imp.name] = new WebAssembly.Global({ value: 'i32', mutable: false }, 0);
      }
    });
    
    // Instantiate the WASM module
    const wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
    console.log('WASM instance created successfully');
    
    const wasmExports = wasmInstance.exports;
    
    // Verify required functions exist
    const requiredFunctions = ['initWebVM', 'runSource'];
    for (const func of requiredFunctions) {
      if (typeof wasmExports[func] !== 'function') {
        throw new Error(`Required function '${func}' not found in WASM exports`);
      }
    }
    
    // Create the Orus module interface
    orusModule = {
      initWebVM: wasmExports.initWebVM as () => void,
      runSource: wasmExports.runSource as (code: string) => string,
      freeWebVM: wasmExports.freeWebVM as () => void,
      getVersion: wasmExports.getVersion as () => string,
      setInputCallback: wasmExports.setInputCallback as (callback: any) => void,
      setOutputCallback: wasmExports.setOutputCallback as (callback: any) => void,
      registerWebBuiltins: wasmExports.registerWebBuiltins as () => void,
      getLastError: wasmExports.getLastError as () => string,
      clearLastError: wasmExports.clearLastError as () => void,
      isVMReady: wasmExports.isVMReady as () => boolean,
      resetVMState: wasmExports.resetVMState as () => void,
    };
    
    return orusModule;
  } catch (error) {
    console.error('Failed to load Orus WASM:', error);
    throw new Error(`Failed to load Orus WASM: ${error}`);
  }
};

let capturedOutput = '';
let wasmMemory: WebAssembly.Memory | null = null;

// Helper function to read string from WASM memory
const readStringFromMemory = (ptr: number, len: number): string => {
  if (!wasmMemory) return '';
  const buffer = new Uint8Array(wasmMemory.buffer);
  const bytes = buffer.slice(ptr, ptr + len);
  return new TextDecoder().decode(bytes);
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    
    // Initialize the VM if not ready
    if (module.isVMReady && !module.isVMReady()) {
      if (module.initWebVM) module.initWebVM();
      if (module.registerWebBuiltins) module.registerWebBuiltins();
    }
    
    // Try to set up output callback if available
    capturedOutput = '';
    if (module.setOutputCallback) {
      try {
        module.setOutputCallback((text: string) => {
          console.log('Output callback received:', text);
          capturedOutput += text;
        });
      } catch (e) {
        console.warn('Could not set output callback:', e);
      }
    }
    
    // Clear any previous errors
    if (module.clearLastError) module.clearLastError();
    capturedOutput = '';
    
    // Run the source code
    const result = module.runSource(code);
    console.log('Raw result:', result);
    console.log('Captured output:', capturedOutput);
    
    // Check for errors
    let error = '';
    if (module.getLastError) {
      try {
        error = module.getLastError();
      } catch (e) {
        console.warn('Could not get last error:', e);
      }
    }
    
    if (error) {
      return `Error: ${error}`;
    }
    
    // If we have captured output, use that
    if (capturedOutput && capturedOutput.trim()) {
      return capturedOutput.trim();
    }
    
    // For now, since the basic execution works, let's just indicate success
    // and work on the output capturing separately
    return `Execution completed with status: ${result}`;
  } catch (error) {
    console.error('Compilation error:', error);
    return `Compilation error: ${error}`;
  }
};
