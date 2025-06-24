
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
    
    // Initialize the WebAssembly module
    const wasmModule = await WebAssembly.instantiate(wasmBytes);
    
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
