// CleanPlayground.tsx: Layout, tabs, toolbar, file management
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import { usePlayground } from './usePlayground';

interface ResizableLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialRightWidth?: number;
  minRightWidth?: number;
  maxRightWidth?: number;
  hasOutput?: boolean;
}

const ResizableLayout: React.FC<ResizableLayoutProps> = ({
  leftPanel,
  rightPanel,
  initialRightWidth = 400,
  minRightWidth = 250,
  maxRightWidth = 800,
  hasOutput = false
}) => {
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = containerRect.right - e.clientX;
    const clampedWidth = Math.max(minRightWidth, Math.min(maxRightWidth, newWidth));
    setRightWidth(clampedWidth);
  }, [isDragging, minRightWidth, maxRightWidth]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (isMobile) {
    return (
      <div ref={containerRef} className="mobile-layout">
        <div className="mobile-editor">
          {leftPanel}
        </div>
        {hasOutput && (
          <div className="mobile-output">
            {rightPanel}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="resizable-layout">
      <div className="left-panel">
        {leftPanel}
      </div>
      <div
        className={`resize-handle ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleMouseDown}
      />
      <div className="right-panel" style={{ width: rightWidth }}>
        {rightPanel}
      </div>

      <style>{`
        .resizable-layout {
          display: flex;
          height: 100%;
          width: 100%;
        }
        .left-panel {
          flex: 1;
          min-width: 0;
        }
        .resize-handle {
          width: 4px;
          background: transparent;
          cursor: col-resize;
          position: relative;
          transition: background 0.2s;
          flex-shrink: 0;
        }
        .resize-handle:hover,
        .resize-handle.dragging {
          background: rgba(99, 102, 241, 0.5);
        }
        .resize-handle::after {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 100%;
          background: rgb(45, 45, 45);
        }
        .right-panel {
          flex-shrink: 0;
          min-width: 250px;
          max-width: 800px;
        }
        
        .mobile-layout {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        .mobile-editor {
          flex: 1;
          min-height: 0;
        }
        .mobile-layout:has(.mobile-output) .mobile-editor {
          max-height: 60vh;
        }
        .mobile-output {
          flex: 0 0 40vh;
          min-height: 200px;
          border-top: 1px solid rgb(45, 45, 45);
        }
      `}</style>
    </div>
  );
};

interface File {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface TabProps {
  file: File;
  isActive: boolean;
  onClick: () => void;
  onClose?: () => void;
  onRename?: (newName: string) => void;
  onRun?: () => void;
}

const Tab: React.FC<TabProps> = ({ file, isActive, onClick, onClose, onRename, onRun }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);

  const handleDoubleClick = () => {
    if (onRename) {
      setIsEditing(true);
      setEditName(file.name);
    }
  };

  const handleSubmit = () => {
    if (onRename && editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(file.name);
    }
  };

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.orus')) return '🦀';
    if (fileName.endsWith('.py')) return '🐍';
    if (fileName.endsWith('.js') || fileName.endsWith('.ts')) return '⚡';
    return '📄';
  };

  return (
    <div className={`file-tab ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="tab-content">
        <div className="tab-left">
          <span className="file-icon">{getFileIcon(file.name)}</span>
          {isEditing ? (
            <input
              className="tab-input"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleSubmit}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <span className="tab-name" onDoubleClick={handleDoubleClick}>
              {file.name}
            </span>
          )}
        </div>
        <div className="tab-right">
          {onRun && (
            <button 
              className="tab-action-button run-action" 
              title="Run File"
              onClick={(e) => {
                e.stopPropagation();
                onRun();
              }}
            >
              <span>▶</span>
            </button>
          )}
          {onClose && (
            <button
              className="tab-action-button close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              title="Close File"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <style>{`
        .file-tab {
          display: flex;
          flex-direction: column;
          width: 100%;
          background: rgb(18, 18, 18);
          border-bottom: 1px solid rgb(40, 40, 40);
          font-size: 13px;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .tab-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 12px;
          height: 40px;
        }
        @media (max-width: 768px) {
          .tab-content {
            padding: 6px 10px;
            height: 36px;
          }
        }
        .tab-left {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tab-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .file-icon {
          font-size: 16px;
          display: flex;
          align-items: center;
          opacity: 0.8;
        }
        .tab-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #e0e0e0;
          font-size: 13px;
        }
        .tab-input {
          background: rgb(40, 40, 40);
          border: 1px solid rgb(60, 60, 60);
          color: #ffffff;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 12px;
          min-width: 80px;
        }
        .tab-input:focus {
          outline: none;
          border-color: #22c55e;
        }
        .file-tab.active {
          background: rgb(18, 18, 18);
        }
        .file-tab.active .tab-name {
          color: #ffffff;
        }
        .tab-action-button {
          background: none;
          border: none;
          color: #7a7a7a;
          font-size: 12px;
          cursor: pointer;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
          transition: all 0.2s;
        }
        .tab-action-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .close-button {
          font-size: 14px;
          font-weight: 600;
        }
        .run-action {
          color: #22c55e;
        }
        .run-action:hover {
          background: rgba(34, 197, 94, 0.1);
        }
      `}</style>
    </div>
  );
};

interface ToolbarProps {
  onRun: () => void;
  isRunning: boolean;
  isRuntimeReady: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  onSettingsClick?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onRun,
  isRunning,
  isRuntimeReady,
  isSaving = false,
  lastSaved = null,
  onSettingsClick
}) => {
  const formatLastSaved = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="logo">
          <div className="logo-icon">🦀</div>
          <span>Orus</span>
        </div>
      </div>
      <div className="toolbar-center">
        <button
          className="toolbar-button run-button"
          onClick={onRun}
          disabled={isRunning || !isRuntimeReady}
          title="Run Code (Ctrl+Enter)"
        >
          {isRunning ? (
            <>
              <div className="spinner"></div>
              <span>Running...</span>
            </>
          ) : (
            <>
              <span>▶</span>
              <span>Run</span>
            </>
          )}
        </button>
        <button 
          className="toolbar-button settings-button" 
          title="Settings"
          onClick={onSettingsClick}
        >
          <span>⚙</span>
        </button>
      </div>
      <div className="toolbar-right">
        <div className="save-status">
          {isSaving ? (
            <>
              <div className="save-spinner"></div>
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <span className="save-check">✓</span>
              <span>Saved {formatLastSaved(lastSaved)}</span>
            </>
          ) : (
            <span className="save-pending">●</span>
          )}
        </div>
      </div>

      <style>{`
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: rgb(25, 25, 25);
          border-bottom: 1px solid rgb(45, 45, 45);
          min-height: 48px;
        }
        @media (max-width: 768px) {
          .toolbar {
            padding: 6px 12px;
            min-height: 44px;
          }
        }
        .toolbar-left {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 16px;
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .logo {
            font-size: 14px;
            gap: 6px;
          }
        }
        .logo-icon {
          font-size: 20px;
        }
        .toolbar-center {
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          flex: 1;
        }
        @media (max-width: 768px) {
          .toolbar-center {
            gap: 8px;
            flex: 0 1 auto;
          }
        }
        .toolbar-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }
        .save-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #9ca3af;
          opacity: 0.8;
        }
        @media (max-width: 768px) {
          .save-status {
            font-size: 10px;
            gap: 4px;
          }
          .save-status span {
            display: none;
          }
          .save-status .save-check,
          .save-status .save-pending,
          .save-status .save-spinner {
            display: block;
          }
        }
        .save-spinner {
          width: 10px;
          height: 10px;
          border: 1px solid rgba(156, 163, 175, 0.3);
          border-top: 1px solid #9ca3af;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .save-check {
          color: #10b981;
          font-size: 10px;
        }
        .save-pending {
          color: #f59e0b;
          font-size: 8px;
        }
        .toolbar-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: 1px solid rgb(55, 55, 55);
          border-radius: 8px;
          background: transparent;
          color: #ffffff;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        @media (max-width: 768px) {
          .toolbar-button {
            padding: 6px 12px;
            font-size: 12px;
            gap: 4px;
          }
        }
        .toolbar-button:hover {
          background: rgb(40, 40, 40);
          border-color: rgb(65, 65, 65);
        }
        .toolbar-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .toolbar-button:disabled:hover {
          background: transparent;
          border-color: rgb(55, 55, 55);
        }
        .run-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          padding: 8px 20px;
          font-weight: 600;
          font-size: 14px;
          color: white;
          box-shadow: 0 1px 3px rgba(16, 185, 129, 0.2);
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .run-button {
            padding: 6px 16px;
            font-size: 13px;
            border-radius: 10px;
          }
        }
        .run-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.25);
        }
        .run-button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(16, 185, 129, 0.2);
        }
        .settings-button {
          background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
          border: none;
          border-radius: 12px;
          padding: 8px 16px;
          font-weight: 600;
          font-size: 14px;
          color: white;
          box-shadow: 0 1px 3px rgba(107, 114, 128, 0.2);
          transition: all 0.2s ease;
        }
        .settings-button:hover {
          background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(107, 114, 128, 0.25);
        }
        .settings-button:active {
          transform: translateY(0);
          box-shadow: 0 1px 3px rgba(107, 114, 128, 0.2);
        }
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

interface OutputLine {
  id: string;
  type: 'normal' | 'info' | 'error' | 'success' | 'warning';
  content: string;
  timestamp: Date;
}

interface OutputPanelProps {
  output: OutputLine[];
  onClear: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ output, onClear }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="output-panel">
      <div className="output-header">
        <div className="panel-title">
          <div className="terminal-icon">$</div>
          <span>TERMINAL</span>
        </div>
        <button className="clear-button" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="output-content" ref={outputRef}>
        {output.map((line) => (
          <div key={line.id} className={`output-line output-${line.type}`}>
            <span className="timestamp">[{formatTimestamp(line.timestamp)}]</span>
            <span className="content">{line.content}</span>
          </div>
        ))}
        {output.length === 0 && (
          <div className="output-line output-info">
            <span className="content">Ready for execution. Run your code to see output here.</span>
          </div>
        )}
      </div>

      <style>{`
        .output-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgb(25, 25, 25);
        }
        .output-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: rgb(20, 20, 20);
          border-bottom: 1px solid rgb(45, 45, 45);
          min-height: 48px;
        }
        @media (max-width: 768px) {
          .output-header {
            padding: 8px 12px;
            min-height: 40px;
          }
        }
        .panel-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #ffffff;
        }
        .terminal-icon {
          width: 16px;
          height: 16px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
          color: white;
        }
        .clear-button {
          background: transparent;
          border: 1px solid rgb(55, 55, 55);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s;
        }
        .clear-button:hover {
          background: rgb(45, 45, 45);
          border-color: rgb(65, 65, 65);
        }
        .output-content {
          flex: 1;
          background: rgb(20, 20, 20);
          color: #e5e7eb;
          font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          padding: 12px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        @media (max-width: 768px) {
          .output-content {
            padding: 8px;
            font-size: 12px;
          }
        }
        .output-line {
          display: flex;
          margin-bottom: 4px;
          padding: 2px 0;
          gap: 8px;
        }
        .timestamp {
          color: #6b7280;
          font-size: 11px;
          flex-shrink: 0;
          min-width: 80px;
        }
        .content {
          flex: 1;
          word-wrap: break-word;
        }
        .output-error .content {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 2px 6px;
          border-radius: 3px;
          border-left: 2px solid #ef4444;
        }
        .output-info .content {
          color: #3b82f6;
        }
        .output-success .content {
          color: #10b981;
        }
        .output-warning .content {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
};

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
  layout: 'horizontal' | 'vertical';
  onLayoutChange: (layout: 'horizontal' | 'vertical') => void;
  fontFamily: string;
  onFontFamilyChange: (family: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  layout,
  onLayoutChange,
  fontFamily,
  onFontFamilyChange,
  fontSize,
  onFontSizeChange
}) => {
  const fontOptions = [
    'JetBrains Mono',
    'Fira Code',
    'Monaco',
    'Menlo',
    'Courier New',
    'monospace'
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`settings-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
        <div className="settings-header">
          <h2>Settings</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="settings-content">
          {/* Theme */}
          <div className="setting-group">
            <label className="setting-label">Theme</label>
            <div className="theme-toggle">
              <button
                className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => onThemeChange('light')}
              >
                <span className="theme-icon">☀️</span>
                Light
              </button>
              <button
                className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => onThemeChange('dark')}
              >
                <span className="theme-icon">🌙</span>
                Dark
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="setting-group">
            <label className="setting-label">Layout</label>
            <div className="layout-toggle">
              <button
                className={`layout-option ${layout === 'horizontal' ? 'active' : ''}`}
                onClick={() => onLayoutChange('horizontal')}
                title="Horizontal Layout"
              >
                <div className="layout-icon horizontal-icon">
                  <div className="layout-left"></div>
                  <div className="layout-right"></div>
                </div>
              </button>
              <button
                className={`layout-option ${layout === 'vertical' ? 'active' : ''}`}
                onClick={() => onLayoutChange('vertical')}
                title="Vertical Layout"
              >
                <div className="layout-icon vertical-icon">
                  <div className="layout-top"></div>
                  <div className="layout-bottom"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Font Family */}
          <div className="setting-group">
            <label className="setting-label">Font Family</label>
            <select 
              className="font-select"
              value={fontFamily}
              onChange={(e) => onFontFamilyChange(e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div className="setting-group">
            <label className="setting-label">Font Size: {fontSize}px</label>
            <div className="font-size-slider">
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                className="slider"
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 998;
        }
        .settings-backdrop.open {
          opacity: 1;
          visibility: visible;
        }
        
        .settings-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 320px;
          height: 100vh;
          background: rgb(25, 25, 25);
          border-left: 1px solid rgb(45, 45, 45);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 999;
          display: flex;
          flex-direction: column;
        }
        .settings-panel.open {
          transform: translateX(0);
        }
        
        .settings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgb(45, 45, 45);
        }
        .settings-header h2 {
          color: #ffffff;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        .close-button {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        }
        .close-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .settings-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        
        .setting-group {
          margin-bottom: 24px;
        }
        .setting-label {
          display: block;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .theme-toggle {
          display: flex;
          background: rgb(18, 18, 18);
          border-radius: 8px;
          padding: 4px;
          gap: 4px;
        }
        .theme-option {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 12px;
          background: none;
          border: none;
          color: #9ca3af;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 13px;
          font-weight: 500;
        }
        .theme-option.active {
          background: rgb(45, 45, 45);
          color: #ffffff;
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.3);
        }
        .theme-option:hover:not(.active) {
          background: rgb(35, 35, 35);
          color: #ffffff;
        }
        .theme-icon {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .layout-toggle {
          display: flex;
          gap: 12px;
        }
        .layout-option {
          width: 56px;
          height: 42px;
          background: rgb(18, 18, 18);
          border: 1.5px solid rgb(45, 45, 45);
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .layout-option.active {
          border-color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
          box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.2);
        }
        .layout-option:hover:not(.active) {
          border-color: rgb(65, 65, 65);
        }
        
        .layout-icon {
          width: 28px;
          height: 20px;
          display: flex;
          gap: 2px;
        }
        .horizontal-icon {
          flex-direction: row;
        }
        .vertical-icon {
          flex-direction: column;
        }
        .layout-left, .layout-right, .layout-top, .layout-bottom {
          background: #6b7280;
          border-radius: 2px;
          transition: background 0.2s ease;
        }
        .layout-left, .layout-right {
          flex: 1;
          height: 100%;
        }
        .layout-top, .layout-bottom {
          width: 100%;
          flex: 1;
        }
        .layout-option.active .layout-left,
        .layout-option.active .layout-right,
        .layout-option.active .layout-top,
        .layout-option.active .layout-bottom {
          background: #6366f1;
        }
        
        .font-select {
          width: 100%;
          padding: 12px;
          background: rgb(18, 18, 18);
          border: 1px solid rgb(45, 45, 45);
          border-radius: 8px;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }
        .font-select:focus {
          outline: none;
          border-color: #6366f1;
        }
        .font-select option {
          background: rgb(18, 18, 18);
          color: #ffffff;
        }
        
        .font-size-slider {
          margin-top: 8px;
        }
        .slider {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: rgb(45, 45, 45);
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          transition: all 0.2s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 2px 6px rgba(99, 102, 241, 0.4);
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #6366f1;
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        @media (max-width: 768px) {
          .settings-panel {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </>
  );
};

export const CleanPlayground: React.FC = () => {
  const {
    files,
    activeFile,
    output,
    isRunning,
    isRuntimeReady,
    isSaving,
    lastSaved,
    runCode,
    clearOutput,
    updateFileContent,
    addNewFile,
    closeFile,
    renameFile
  } = usePlayground();

  // Settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fontFamily, setFontFamily] = useState('JetBrains Mono');
  const [fontSize, setFontSize] = useState(14);

  const handleCodeChange = (value: string) => {
    if (activeFile) {
      updateFileContent(activeFile.id, value);
    }
  };

  // Always run the current active file's content
  const handleRunCode = () => {
    runCode();
  };

  const editorPanel = (
    <div className="editor-panel">
      <div className="editor-tabs-container">
        <div className="editor-tabs-scrollable">
          {activeFile && (
            <Tab
              key={activeFile.id}
              file={activeFile}
              isActive={true}
              onClick={() => {}}
              onClose={files.length > 1 ? () => closeFile(activeFile.id) : undefined}
              onRename={(newName) => renameFile(activeFile.id, newName)}
              onRun={handleRunCode}
            />
          )}
        </div>
        <div className="tab-actions">
          <button
            className="tab-action-button new-file-button"
            onClick={() => addNewFile('untitled.orus')}
            title="New file"
          >
            <span>+</span>
          </button>
        </div>
      </div>
      <div className="editor-container">
        {activeFile && (
          <CodeEditor
            value={activeFile.content}
            onChange={handleCodeChange}
            language={activeFile.language}
            onRun={handleRunCode}
          />
        )}
      </div>

      <style>{`
        .editor-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgb(18, 18, 18);
        }
        .editor-tabs-container {
          display: flex;
          justify-content: space-between;
          background: rgb(18, 18, 18);
          height: 40px;
          border-bottom: 1px solid rgb(40, 40, 40);
        }
        @media (max-width: 768px) {
          .editor-tabs-container {
            height: 36px;
          }
        }
        .editor-tabs-scrollable {
          display: flex;
          flex: 1;
          overflow-x: auto;
          overflow-y: hidden;
          scrollbar-width: thin;
        }
        .editor-tabs-scrollable::-webkit-scrollbar {
          height: 3px;
        }
        .editor-tabs-scrollable::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .tab-actions {
          display: flex;
          align-items: center;
          padding-right: 8px;
        }
        .tab-action-button {
          background: transparent;
          border: none;
          color: #7a7a7a;
          border-radius: 3px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
          height: 24px;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          margin: 0 2px;
        }
        .new-file-button {
          margin-left: 4px;
        }
        .tab-action-button:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }
        .editor-container {
          flex: 1;
          position: relative;
          background: rgb(18, 18, 18);
          border-top: 1px solid rgb(30, 30, 30);
        }
      `}</style>
    </div>
  );

  const outputPanel = (
    <OutputPanel output={output} onClear={clearOutput} />
  );

  return (
    <div className="clean-playground">
      <Toolbar
        onRun={handleRunCode}
        isRunning={isRunning}
        isRuntimeReady={isRuntimeReady}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <div className="main-content">
        <ResizableLayout
          leftPanel={editorPanel}
          rightPanel={outputPanel}
          initialRightWidth={400}
          minRightWidth={250}
          maxRightWidth={800}
          hasOutput={output.length > 0}
        />
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onThemeChange={setTheme}
        layout={layout}
        onLayoutChange={setLayout}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
      />

      <style>{`
        .clean-playground {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: rgb(18, 18, 18);
          color: #ffffff;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        @media (max-width: 768px) {
          .clean-playground {
            height: 100dvh;
            min-height: 100vh;
          }
        }
        .main-content {
          flex: 1;
          min-height: 0;
        }
      `}</style>
    </div>
  );
};