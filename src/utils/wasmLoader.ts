
interface OrusModule {
  compile_and_run: (code: string) => string;
}

let orusModule: OrusModule | null = null;

export const loadOrusWasm = async (): Promise<OrusModule> => {
  if (orusModule) {
    return orusModule;
  }

  try {
    // Load the WASM file
    const wasmResponse = await fetch('/orus-web.wasm');
    const wasmBytes = await wasmResponse.arrayBuffer();
    
    // Create imports object - this is required for WASM instantiation
    const imports = {
      env: {
        // Add any environment functions that the WASM module might need
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
      },
      wasi_snapshot_preview1: {
        // WASI functions that might be needed
        proc_exit: () => {},
        fd_close: () => 0,
        fd_seek: () => 0,
        fd_write: () => 0,
        fd_read: () => 0,
      }
    };
    
    // Initialize the WebAssembly module with imports
    const wasmModule = await WebAssembly.instantiate(wasmBytes, imports);
    
    // Create the Orus module interface
    orusModule = {
      compile_and_run: (code: string) => {
        try {
          // Call the WASM function to compile and run Orus code
          const result = wasmModule.instance.exports.compile_and_run as Function;
          return result(code) || 'No output';
        } catch (error) {
          return `Runtime error: ${error}`;
        }
      }
    };
    
    return orusModule;
  } catch (error) {
    throw new Error(`Failed to load Orus WASM: ${error}`);
  }
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    return module.compile_and_run(code);
  } catch (error) {
    return `Compilation error: ${error}`;
  }
};
