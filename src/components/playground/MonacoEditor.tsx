// MonacoEditor.tsx: Core editor functionality (90% of editor logic)
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onKeyDown?: (e: monaco.IKeyboardEvent) => void;
}

export class MonacoEditor {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private container: HTMLElement;
  private props: MonacoEditorProps;

  constructor(container: HTMLElement, props: MonacoEditorProps) {
    this.container = container;
    this.props = props;
    this.initializeEditor();
  }

  private initializeEditor() {
    // Define custom theme for Orus-like appearance
    monaco.editor.defineTheme('orus-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'constant', foreground: '4FC1FF' },
        { token: 'delimiter', foreground: 'D4D4D4' },
      ],
      colors: {
        'editor.background': '#1E1E1E',
        'editor.foreground': '#D4D4D4',
        'editor.lineHighlightBackground': '#2D2D30',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#C6C6C6',
        'editor.selectionHighlightBackground': '#ADD6FF26',
        'editor.wordHighlightBackground': '#575757B8',
        'editor.findMatchBackground': '#515C6A',
        'editor.findMatchHighlightBackground': '#EA5C0040',
        'editorBracketMatch.background': '#0064001A',
        'editorBracketMatch.border': '#888888',
      }
    });

    // Create the editor instance
    this.editor = monaco.editor.create(this.container, {
      value: this.props.value,
      language: this.props.language,
      theme: 'orus-dark',
      fontSize: 14,
      lineHeight: 20,
      fontFamily: 'SF Mono, Monaco, Inconsolata, Roboto Mono, Consolas, monospace',
      fontWeight: '400',
      letterSpacing: 0.5,
      minimap: { 
        enabled: false,
        showSlider: 'mouseover'
      },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 4,
      insertSpaces: true,
      renderLineHighlight: 'gutter',
      selectionHighlight: false,
      occurrencesHighlight: 'singleFile',
      renderWhitespace: 'selection',
      showFoldingControls: 'mouseover',
      foldingStrategy: 'indentation',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      contextmenu: true,
      mouseWheelZoom: true,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      snippetSuggestions: 'top',
      wordBasedSuggestions: 'off',
      parameterHints: {
        enabled: true,
        cycle: true
      },
      hover: {
        enabled: true,
        delay: 300
      },
      bracketPairColorization: {
        enabled: true
      }
    });

    this.setupEventListeners();
    this.setupLanguageFeatures();
    
    if (this.props.onMount) {
      this.props.onMount(this.editor);
    }
  }

  private setupEventListeners() {
    if (!this.editor) return;

    // Content change listener
    this.editor.onDidChangeModelContent(() => {
      const value = this.editor?.getValue() || '';
      this.props.onChange(value);
    });

    // Keyboard event listener
    this.editor.onKeyDown((e) => {
      if (this.props.onKeyDown) {
        this.props.onKeyDown(e);
      }
    });

    // Focus/blur handling for better UX
    this.editor.onDidFocusEditorText(() => {
      this.container.classList.add('editor-focused');
    });

    this.editor.onDidBlurEditorText(() => {
      this.container.classList.remove('editor-focused');
    });
  }

  private setupLanguageFeatures() {
    // Register a custom language for Orus (Rust-like syntax)
    monaco.languages.register({ id: 'orus' });

    // Define language tokens
    monaco.languages.setMonarchTokensProvider('orus', {
      tokenizer: {
        root: [
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],
          
          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],
          
          // Keywords
          [/\b(struct|impl|fn|let|mut|if|else|while|for|in|return|as|i32|bool)\b/, 'keyword'],
          
          // Types
          [/\b(i32|i64|u32|u64|f32|f64|bool|str|String)\b/, 'type'],
          
          // Numbers
          [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
          [/\d+/, 'number'],
          
          // Identifiers
          [/[a-zA-Z_]\w*/, 'identifier'],
          
          // Operators
          [/[+\-*/%=!<>&|^~]/, 'operator'],
          
          // Delimiters
          [/[{}()\[\]]/, 'delimiter.bracket'],
          [/[;,.]/, 'delimiter'],
        ],
        
        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment']
        ],
        
        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop']
        ]
      }
    });

    // Set up language configuration
    monaco.languages.setLanguageConfiguration('orus', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      folding: {
        markers: {
          start: new RegExp('^\\s*//\\s*#?region\\b'),
          end: new RegExp('^\\s*//\\s*#?endregion\\b')
        }
      }
    });
  }

  // Public methods
  public getValue(): string {
    return this.editor?.getValue() || '';
  }

  public setValue(value: string): void {
    this.editor?.setValue(value);
  }

  public focus(): void {
    this.editor?.focus();
  }

  public layout(): void {
    this.editor?.layout();
  }

  public addKeyBinding(keybinding: number, handler: () => void): void {
    this.editor?.addCommand(keybinding, handler);
  }

  public setLanguage(language: string): void {
    const model = this.editor?.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, language);
    }
  }

  public insertText(text: string): void {
    const selection = this.editor?.getSelection();
    if (selection) {
      this.editor?.executeEdits('', [{
        range: selection,
        text: text
      }]);
    }
  }

  public formatDocument(): void {
    this.editor?.getAction('editor.action.formatDocument')?.run();
  }

  public dispose(): void {
    this.editor?.dispose();
  }

  // Getters
  public get instance(): monaco.editor.IStandaloneCodeEditor | null {
    return this.editor;
  }

  public get isDisposed(): boolean {
    return this.editor === null;
  }
}