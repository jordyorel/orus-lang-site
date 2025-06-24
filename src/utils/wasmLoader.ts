
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
    
    // First, let's inspect the module to see what it actually exports/imports
    const wasmModule = await WebAssembly.compile(wasmBytes);
    const imports = WebAssembly.Module.imports(wasmModule);
    const exports = WebAssembly.Module.exports(wasmModule);
    
    console.log('WASM imports required:', imports);
    console.log('WASM exports available:', exports);
    
    // Create a minimal imports object based on what we see
    const importObject: any = {};
    
    // Add import objects based on what the module actually needs
    imports.forEach((imp) => {
      if (!importObject[imp.module]) {
        importObject[imp.module] = {};
      }
      
      if (imp.kind === 'function') {
        // Provide stub functions for any imported functions
        importObject[imp.module][imp.name] = (...args: any[]) => {
          console.log(`Called imported function ${imp.module}.${imp.name} with args:`, args);
          return 0; // Default return value
        };
      } else if (imp.kind === 'memory') {
        // Provide memory if needed
        importObject[imp.module][imp.name] = new WebAssembly.Memory({ initial: 256, maximum: 256 });
      } else if (imp.kind === 'global') {
        // Provide global if needed
        importObject[imp.module][imp.name] = new WebAssembly.Global({ value: 'i32', mutable: false }, 0);
      }
    });
    
    console.log('Created import object:', importObject);
    
    // Initialize the WebAssembly module with the correct imports
    const wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
    console.log('WASM instance created successfully');
    console.log('Available exports:', Object.keys(wasmInstance.exports));
    
    // Get the required functions from WASM exports
    const wasmExports = wasmInstance.exports;
    
    // Verify required functions exist
    const requiredFunctions = ['initWebVM', 'runSource', 'freeWebVM'];
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

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    
    // Initialize the VM if not ready
    if (!module.isVMReady()) {
      module.initWebVM();
      module.registerWebBuiltins();
    }
    
    // Set up output callback to capture printed text
    capturedOutput = '';
    try {
      module.setOutputCallback((text: string) => {
        console.log('Captured output:', text);
        capturedOutput += text;
      });
    } catch (e) {
      console.warn('Could not set output callback:', e);
    }
    
    // Clear any previous errors and output
    module.clearLastError();
    capturedOutput = '';
    
    // Run the source code
    const result = module.runSource(code);
    console.log('Raw result:', result);
    console.log('Captured output:', capturedOutput);
    
    // Check for errors
    const error = module.getLastError();
    if (error) {
      return `Error: ${error}`;
    }
    
    // If we have captured output, use that; otherwise format the result
    if (capturedOutput) {
      return capturedOutput;
    }
    
    // The result might be the actual output or a status code
    // Let's return both for debugging
    return result ? `Output: ${result}` : 'No output';
  } catch (error) {
    console.error('Compilation error:', error);
    return `Compilation error: ${error}`;
  }
};
