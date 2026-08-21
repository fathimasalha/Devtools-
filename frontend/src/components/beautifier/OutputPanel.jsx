import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, Download } from 'lucide-react';

const OutputPanelActions = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!code) return;
    const extMap = {
      javascript: 'js',
      js: 'js',
      python: 'py',
      html: 'html',
      css: 'css',
      json: 'json',
      java: 'java',
    };
    const ext = extMap[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified-code.${ext}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        disabled={!code}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
          copied
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed'
        }`}
        title="Copy to clipboard"
      >
        {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      <button
        onClick={handleDownload}
        disabled={!code}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        title="Download file"
      >
        <Download size={14} />
        <span>Download</span>
      </button>
    </div>
  );
};

const OutputPanel = ({ code, language, height = '500px' }) => {
  const getMonacoLanguage = (lang) => {
    const map = {
      js: 'javascript',
      javascript: 'javascript',
      py: 'python',
      python: 'python',
      html: 'html',
      css: 'css',
      json: 'json',
      java: 'java',
      auto: 'javascript',
      plaintext: 'plaintext'
    };
    return map[lang] || 'plaintext';
  };

  return (
    <div className="w-full h-full min-h-[350px] overflow-hidden rounded-xl bg-[#12131a] border border-white/5">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code || '// Beautified code will appear here after clicking "Beautify Code"'}
        theme="vs-dark"
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace",
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          renderWhitespace: 'selection',
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          contextmenu: true,
        }}
      />
    </div>
  );
};

OutputPanel.Actions = OutputPanelActions;
export default OutputPanel;