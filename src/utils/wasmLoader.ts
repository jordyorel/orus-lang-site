
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
        // Special handling for output functions
        if (imp.name === 'fd_write') {
          importObject[imp.module][imp.name] = (fd: number, iov: number, iovcnt: number, pnum: number) => {
            console.log(`fd_write called: fd=${fd}, iov=${iov}, iovcnt=${iovcnt}, pnum=${pnum}`);
            // fd_write is used to write to file descriptors (stdout=1, stderr=2)
            if ((fd === 1 || fd === 2) && wasmMemory) {
              try {
                // Read iovec structures from memory
                const buffer = new Uint8Array(wasmMemory.buffer);
                const view = new DataView(wasmMemory.buffer);
                let totalOutput = '';
                
                for (let i = 0; i < iovcnt; i++) {
                  const iovecPtr = iov + i * 8; // Each iovec is 8 bytes (ptr + len)
                  const bufPtr = view.getUint32(iovecPtr, true);
                  const bufLen = view.getUint32(iovecPtr + 4, true);
                  
                  if (bufPtr && bufLen) {
                    const text = readStringFromMemory(bufPtr, bufLen);
                    totalOutput += text;
                  }
                }
                
                if (totalOutput) {
                  console.log('Captured fd_write output:', totalOutput);
                  capturedOutput += totalOutput;
                }
              } catch (e) {
                console.warn('Error reading fd_write memory:', e);
              }
            }
            return iovcnt; // Return number of bytes written
          };
        } else if (imp.name.includes('print') || imp.name.includes('write') || imp.name.includes('puts')) {
          importObject[imp.module][imp.name] = (...args: any[]) => {
            console.log(`Output function ${imp.module}.${imp.name} called with:`, args);
            // Try to capture output from these functions
            if (args.length > 0) {
              capturedOutput += String(args[0]);
            }
            return 0;
          };
        } else {
          // Provide stub functions for any other imported functions
          importObject[imp.module][imp.name] = (...args: any[]) => {
            console.log(`Called imported function ${imp.module}.${imp.name} with args:`, args);
            return 0; // Default return value
          };
        }
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
    
    // Store memory reference for fd_write handling
    wasmMemory = wasmExports.memory as WebAssembly.Memory;
    
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
      __wasmExports: wasmExports, // Store reference to all exports for debugging
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
    
    // Memory reference is already set during WASM loading
    
    // Initialize the VM if not ready
    if (!module.isVMReady()) {
      module.initWebVM();
      module.registerWebBuiltins();
    }
    
    // Set up output callback to capture printed text
    capturedOutput = '';
    try {
      // Try different callback approaches
      if (typeof module.setOutputCallback === 'function') {
        module.setOutputCallback((text: string) => {
          console.log('Output callback called with:', text);
          capturedOutput += text;
        });
      }
      
      // Also try setting up input callback in case it's needed
      if (typeof module.setInputCallback === 'function') {
        module.setInputCallback(() => '');
      }
    } catch (e) {
      console.warn('Could not set callbacks:', e);
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
    if (capturedOutput && capturedOutput.trim()) {
      return capturedOutput.trim();
    }
    
    // Maybe the output is stored somewhere else - let's try to get it through other means
    // Some WASM modules store output in a buffer that needs to be retrieved
    try {
      // Try to call any output-related functions that might exist
      const wasmExports = (module as any).__wasmExports;
      if (wasmExports) {
        console.log('Available WASM exports:', Object.keys(wasmExports));
        
        // Look for functions that might contain output
        for (const [name, func] of Object.entries(wasmExports)) {
          if (typeof func === 'function' && 
              (name.includes('output') || name.includes('buffer') || name.includes('result'))) {
            console.log(`Found potential output function: ${name}`);
            try {
              const output = (func as Function)();
              if (output && typeof output === 'string') {
                return output;
              }
            } catch (e) {
              console.log(`Error calling ${name}:`, e);
            }
          }
        }
      }
    } catch (e) {
      console.log('Error trying to get output buffer:', e);
    }
    
    // The result might be the actual output or a status code
    return result ? `Execution completed with status: ${result}` : 'No output';
  } catch (error) {
    console.error('Compilation error:', error);
    return `Compilation error: ${error}`;
  }
};
