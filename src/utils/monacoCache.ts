
let monacoInstance: any = null;
let editorInstance: any = null;

export const getMonacoInstance = () => monacoInstance;
export const setMonacoInstance = (monaco: any) => {
  monacoInstance = monaco;
};

export const getEditorInstance = () => editorInstance;
export const setEditorInstance = (editor: any) => {
  editorInstance = editor;
};

export const clearEditorCache = () => {
  editorInstance = null;
  // Don't clear monaco instance as it can be reused
};
