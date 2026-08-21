import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ value, onChange, language, onBlur, onMouseLeave, height = '500px' }) => {
  const handleEditorChange = (newValue) => {
    onChange(newValue || '');
  };

  // Map languages to Monaco-supported language identifiers
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
    <div className="w-full h-full min-h-[350px] overflow-hidden rounded-xl bg-[#12131a] border border-white/5" onBlur={onBlur} onMouseLeave={onMouseLeave} tabIndex={0}>
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
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
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          contextmenu: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;