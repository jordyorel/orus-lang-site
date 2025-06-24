
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
let moduleLoadPromise: Promise<OrusModule> | null = null;

export const loadOrusWasm = async (): Promise<OrusModule> => {
  if (orusModule) {
    return orusModule;
  }

  if (moduleLoadPromise) {
    return moduleLoadPromise;
  }

  moduleLoadPromise = new Promise(async (resolve, reject) => {
    try {
      // Load the Emscripten-generated JavaScript file
      const scriptElement = document.createElement('script');
      scriptElement.src = '/orus-web.js';
      
      // Wait for the script to load
      await new Promise((scriptResolve, scriptReject) => {
        scriptElement.onload = scriptResolve;
        scriptElement.onerror = scriptReject;
        document.head.appendChild(scriptElement);
      });

      console.log('Orus script loaded, checking for module...');
      
      // The Emscripten-generated script should expose a factory function
      const createModule = (window as any).Module || (window as any).createModule;
      
      if (!createModule) {
        throw new Error('Orus module factory not found. Expected Module or createModule on window.');
      }

      console.log('Found module factory, initializing...');

      // Initialize the Emscripten module
      let moduleInstance;
      if (typeof createModule === 'function') {
        // It's a factory function - call it to create the module
        moduleInstance = await createModule({
          locateFile: (path: string) => {
            // Ensure WASM file is loaded from the correct path
            if (path.endsWith('.wasm')) {
              return '/orus-web.wasm';
            }
            return path;
          },
          onRuntimeInitialized: () => {
            console.log('Emscripten runtime initialized');
          }
        });
      } else {
        // It's already the module object
        moduleInstance = createModule;
      }

      console.log('Module instance created:', moduleInstance);
      console.log('Available functions:', Object.keys(moduleInstance).filter(key => typeof moduleInstance[key] === 'function'));

      orusModule = moduleInstance;
      resolve(moduleInstance);
    } catch (error) {
      console.error('Failed to load Orus WASM:', error);
      moduleLoadPromise = null; // Reset so we can try again
      reject(new Error(`Failed to load Orus WASM: ${error}`));
    }
  });

  return moduleLoadPromise;
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    console.log('Running code with module:', module);

    // Initialize the VM if not ready
    if (module.isVMReady && !module.isVMReady()) {
      console.log('Initializing VM...');
      if (module.initWebVM) module.initWebVM();
      if (module.registerWebBuiltins) module.registerWebBuiltins();
    }

    // Clear any previous errors
    if (module.clearLastError) module.clearLastError();

    console.log('Executing code:', code);
    
    // Run the source code
    const result = module.runSource(code);
    console.log('Execution result:', result);

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

    return result || 'Code executed successfully';
  } catch (error) {
    console.error('Code execution error:', error);
    return `Execution error: ${error}`;
  }
};
