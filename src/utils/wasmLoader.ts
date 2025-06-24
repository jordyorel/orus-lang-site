
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
    // Load the pre-compiled JavaScript module that comes with the WASM
    const scriptElement = document.createElement('script');
    scriptElement.src = '/orus-web.js';
    
    // Wait for the script to load
    await new Promise((resolve, reject) => {
      scriptElement.onload = resolve;
      scriptElement.onerror = reject;
      document.head.appendChild(scriptElement);
    });

    // The script should expose the Orus module on the global object
    // Check common patterns for how WASM modules are exposed
    const globalOrus = (window as any).Orus || (window as any).OrusModule || (window as any).Module;
    
    if (!globalOrus) {
      throw new Error('Orus module not found on global object after loading script');
    }

    console.log('Loaded Orus module:', globalOrus);
    console.log('Available methods:', Object.keys(globalOrus));

    // Initialize the module if needed
    if (typeof globalOrus.then === 'function') {
      // It's a promise-based module
      orusModule = await globalOrus;
    } else if (typeof globalOrus === 'function') {
      // It's a factory function
      orusModule = await globalOrus();
    } else {
      // It's already the module
      orusModule = globalOrus;
    }

    console.log('Initialized Orus module:', orusModule);
    return orusModule;
  } catch (error) {
    console.error('Failed to load Orus WASM via JS file:', error);
    throw new Error(`Failed to load Orus WASM: ${error}`);
  }
};

export const runOrusCode = async (code: string): Promise<string> => {
  try {
    const module = await loadOrusWasm();
    console.log('Running code with module:', module);

    // Initialize the VM if not ready
    if (module.isVMReady && !module.isVMReady()) {
      if (module.initWebVM) module.initWebVM();
      if (module.registerWebBuiltins) module.registerWebBuiltins();
    }

    // Clear any previous errors
    if (module.clearLastError) module.clearLastError();

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
