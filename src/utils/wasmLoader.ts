
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
    
    // Try to find the correct function name for compilation
    const possibleFunctionNames = [
      'compile_and_run',
      'compile',
      'run',
      'execute',
      'main',
      'orus_compile',
      'orus_run'
    ];
    
    let compileFunction: Function | null = null;
    for (const name of possibleFunctionNames) {
      if (typeof wasmInstance.exports[name] === 'function') {
        compileFunction = wasmInstance.exports[name] as Function;
        console.log(`Found compile function: ${name}`);
        break;
      }
    }
    
    if (!compileFunction) {
      throw new Error(`No suitable compile function found. Available exports: ${Object.keys(wasmInstance.exports).join(', ')}`);
    }
    
    // Create the Orus module interface
    orusModule = {
      compile_and_run: (code: string) => {
        try {
          console.log('Attempting to compile code:', code.substring(0, 100) + '...');
          const result = compileFunction!(code);
          console.log('Compilation result:', result);
          return result || 'No output';
        } catch (error) {
          console.error('Runtime error during compilation:', error);
          return `Runtime error: ${error}`;
        }
      }
    };
    
    return orusModule;
  } catch (error) {
    console.error('Failed to load Orus WASM:', error);
    throw new Error(`Failed to load Orus WASM: ${error}`);
  }
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    return module.compile_and_run(code);
  } catch (error) {
    console.error('Compilation error:', error);
    return `Compilation error: ${error}`;
  }
};
