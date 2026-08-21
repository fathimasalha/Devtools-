import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Code2, 
  Trash2, 
  Clipboard, 
  Check, 
  AlertCircle, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Rocket, 
  Lightbulb, 
  FileCode2,
  RefreshCw
} from 'lucide-react';
import './Beautifier.css';

const languages = [
  { value: 'auto', label: 'Auto Detect' },
  { value: 'js', label: 'JavaScript' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'json', label: 'JSON' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' }
];

const sampleCodes = {
  js: `function calculateTotal(items,taxRate=0.08){let subtotal=0;for(let i=0;i<items.length;i++){subtotal+=items[i].price*items[i].qty;}const tax=subtotal*taxRate;return {subtotal:subtotal,tax:tax,total:subtotal+tax};}console.log(calculateTotal([{price:10,qty:2},{price:15,qty:1}]));`,
  python: `def process_user_data(users):
    active_users=[u for u in users if u.get('is_active',False)]
    sorted_users=sorted(active_users,key=lambda x:x['score'],reverse=True)
    return {'total':len(users),'active_count':len(active_users),'top_user':sorted_users[0] if sorted_users else None}`,
  json: `{"app":"DevTools","version":"1.0.0","settings":{"theme":"dark","autoSave":true,"tabSize":2},"features":["ipinfo","beautifier","wordcount","qrgenerator"],"active":true}`,
  html: `<!DOCTYPE html><html><head><title>Sample</title><meta charset="utf-8"/></head><body><div id="root"><header class="header"><h1>Welcome</h1><p>Modern Dev Tools</p></header><main><section><button class="btn">Click me</button></section></main></div></body></html>`,
  css: `.container{max-width:1200px;margin:0 auto;padding:20px;display:flex;flex-direction:column;align-items:center;}.btn{background:#667eea;color:#fff;border-radius:8px;padding:10px 20px;border:none;cursor:pointer;transition:all 0.3s ease;}.btn:hover{background:#764ba2;transform:translateY(-2px);}`,
  java: `public class Main{public static void main(String[] args){int[] numbers={5,2,8,1,9};int max=numbers[0];for(int i=1;i<numbers.length;i++){if(numbers[i]>max){max=numbers[i];}}System.out.println("Maximum: "+max);}}`
};

const Beautifier = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const [pasted, setPasted] = useState(false);
  const [editorHeight, setEditorHeight] = useState(
    typeof window !== 'undefined' && window.innerWidth < 640 
      ? '330px' 
      : typeof window !== 'undefined' && window.innerWidth < 1024 
        ? '390px' 
        : '480px'
  );

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setEditorHeight('330px');
      } else if (window.innerWidth < 1024) {
        setEditorHeight('390px');
      } else {
        setEditorHeight('480px');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Enhanced function to detect language based on code content
  const detectLanguage = (code) => {
    if (!code || !code.trim()) return 'auto';
    const trimmed = code.trim();

    // 1. JSON Detection (valid JSON object or array)
    if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
      try {
        JSON.parse(trimmed);
        return 'json';
      } catch (e) {}
    }

    // 2. HTML Detection (tags, doctype, structure)
    if (
      trimmed.toLowerCase().includes('<!doctype') ||
      trimmed.toLowerCase().includes('<html') ||
      trimmed.toLowerCase().includes('<head') ||
      trimmed.toLowerCase().includes('<body') ||
      /<\/?[a-z][\s\S]*>/i.test(trimmed) ||
      (trimmed.startsWith('<') && (trimmed.includes('class=') || trimmed.includes('id=') || trimmed.includes('src=') || trimmed.includes('href=')))
    ) {
      return 'html';
    }

    // 3. Java Detection
    if (
      trimmed.includes('public class') ||
      trimmed.includes('private class') ||
      trimmed.includes('public static void main') ||
      trimmed.includes('System.out.println') ||
      trimmed.includes('System.out.print') ||
      trimmed.includes('String[] args') ||
      trimmed.includes('import java.') ||
      trimmed.includes('package ') ||
      /@Override\b/.test(trimmed)
    ) {
      return 'java';
    }

    // 4. Python Detection
    if (
      /\bdef\s+\w+\s*\(/.test(trimmed) ||
      /\bclass\s+\w+(\(.*\))?\s*:/.test(trimmed) ||
      /\bimport\s+[a-zA-Z0-9_]+/.test(trimmed) ||
      /\bfrom\s+[a-zA-Z0-9_]+\s+import/.test(trimmed) ||
      /\bprint\s*\(/.test(trimmed) ||
      /\belif\s+/.test(trimmed) ||
      /\bexcept(\s+\w+)?:/.test(trimmed) ||
      /\bfinally:/.test(trimmed) ||
      /\bwith\s+open\(/.test(trimmed) ||
      trimmed.includes('if __name__ == "__main__":') ||
      trimmed.includes("if __name__ == '__main__':") ||
      /\blambda\s+/.test(trimmed) ||
      /\bself\.\w+/.test(trimmed) ||
      trimmed.includes('None') ||
      trimmed.includes('True') ||
      trimmed.includes('False')
    ) {
      return 'python';
    }

    // 5. CSS Detection
    if (
      /[.#][\w-]+\s*\{[^}]*\}/.test(trimmed) ||
      /@media\b/.test(trimmed) ||
      /@keyframes\b/.test(trimmed) ||
      (trimmed.includes('{') && trimmed.includes('}') && (
        trimmed.includes('color:') ||
        trimmed.includes('background:') ||
        trimmed.includes('margin:') ||
        trimmed.includes('padding:') ||
        trimmed.includes('display:') ||
        trimmed.includes('font-size:') ||
        trimmed.includes('border:') ||
        trimmed.includes('width:') ||
        trimmed.includes('height:')
      ))
    ) {
      return 'css';
    }

    // 6. JavaScript / TypeScript Detection
    if (
      /\bfunction\s*\w*\s*\(/.test(trimmed) ||
      /\b(const|let|var)\s+\w+\s*=/.test(trimmed) ||
      /\bconsole\.(log|error|warn|info)\(/.test(trimmed) ||
      /=>\s*\{?/.test(trimmed) ||
      /\bdocument\.(getElementById|querySelector|addEventListener)\b/.test(trimmed) ||
      /\bwindow\.\w+/.test(trimmed) ||
      /\bexport\s+(default|const|let|var|function)\b/.test(trimmed) ||
      /\brequire\s*\(/.test(trimmed) ||
      /\bimport\s+.*\s+from\s+['"]/.test(trimmed)
    ) {
      return 'js';
    }

    return 'auto';
  };

  const handleInputChange = (value) => {
    setInputCode(value);
    if (value.trim()) {
      const detected = detectLanguage(value);
      if (detected && detected !== 'auto') {
        setDetectedLanguage(detected);
        setSelectedLanguage(detected);
      }
    } else {
      setDetectedLanguage('');
      setSelectedLanguage('auto');
    }
  };

  const handleInputBlur = () => {
    if (inputCode.trim()) {
      const detected = detectLanguage(inputCode);
      if (detected && detected !== 'auto') {
        setDetectedLanguage(detected);
        setSelectedLanguage(detected);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputCode(text);
        const detected = detectLanguage(text);
        if (detected && detected !== 'auto') {
          setDetectedLanguage(detected);
          setSelectedLanguage(detected);
        }
        setPasted(true);
        setTimeout(() => setPasted(false), 1500);
      }
    } catch (e) {
      // clipboard access fallback
    }
  };

  const handleClear = () => {
    setInputCode('');
    setOutputCode('');
    setError('');
    setDetectedLanguage('');
    setSelectedLanguage('auto');
  };

  const loadSample = (langKey) => {
    const key = langKey || 'js';
    const sample = sampleCodes[key] || sampleCodes.js;
    setInputCode(sample);
    setDetectedLanguage(key);
    setSelectedLanguage(key);
    setError('');
  };

  const beautifyCode = async () => {
    if (!inputCode.trim()) {
      setError('Please enter or paste some code to beautify.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      let languageToSend = selectedLanguage;
      if (selectedLanguage === 'auto') {
        languageToSend = detectLanguage(inputCode);
        if (languageToSend === 'auto') {
          languageToSend = 'js';
        }
      }
      
      const langMap = {
        js: 'javascript',
        python: 'python',
        html: 'html',
        css: 'css',
        json: 'json',
        java: 'java',
      };
      const apiLang = langMap[languageToSend] || languageToSend;
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/beautify/`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode, language: apiLang }),
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to beautify code');
      }
      
      setOutputCode(data.beautified_code || '');
      if (data.language) {
        setDetectedLanguage(data.language);
      }
    } catch (err) {
      // Fallback for JSON formatting locally if API is offline
      if (selectedLanguage === 'json' || detectLanguage(inputCode) === 'json') {
        try {
          const parsed = JSON.parse(inputCode);
          setOutputCode(JSON.stringify(parsed, null, 2));
          setError('');
          return;
        } catch (e) {}
      }
      setError(err.message || 'Error communicating with beautifier service.');
    } finally {
      setLoading(false);
    }
  };

  const currentActiveLang = selectedLanguage === 'auto' 
    ? (detectedLanguage || 'auto') 
    : selectedLanguage;

  const linesCount = inputCode ? inputCode.split('\n').length : 0;
  const charsCount = inputCode.length;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 space-y-8 animate-fadeIn">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-300">
          <Sparkles size={14} className="text-purple-400" />
          <span>Multi-Language Code Formatter</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
          Code <span className="font-semibold bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">Beautifier</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
          Reformat, align, and beautify messy, minified, or unformatted code with intelligent syntax detection and precision formatting.
        </p>
      </div>

      {/* Main Control Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5 sm:gap-4">
        {/* Left: Language Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 w-full sm:w-auto">
            <Code2 size={16} className="text-purple-400 flex-shrink-0" />
            <label htmlFor="language" className="text-xs font-medium text-gray-300 whitespace-nowrap">Language:</label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-black/60 text-white text-xs rounded-lg px-2.5 py-1.5 border border-white/10 focus:outline-none focus:border-purple-400 transition-colors cursor-pointer flex-1 sm:flex-none"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-gray-900 text-white">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Quick actions and Beautify button */}
        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5 flex-wrap">
          {/* Sample Presets */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
            <span className="text-[10px] sm:text-[11px] text-gray-400 px-1.5 sm:px-2 font-medium whitespace-nowrap">Samples:</span>
            {['js', 'python', 'json', 'html', 'css'].map((langKey) => (
              <button
                key={langKey}
                onClick={() => loadSample(langKey)}
                className="px-1.5 sm:px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors uppercase whitespace-nowrap"
              >
                {langKey}
              </button>
            ))}
          </div>

          {/* Clear Button */}
          {inputCode && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
              title="Clear editor"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          {/* Main Action Button */}
          <motion.button
            onClick={beautifyCode}
            disabled={loading || !inputCode.trim()}
            whileHover={{ scale: inputCode.trim() ? 1.02 : 1 }}
            whileTap={{ scale: inputCode.trim() ? 0.98 : 1 }}
            className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 shadow-lg w-full sm:w-auto ${
              loading || !inputCode.trim()
                ? 'bg-white/10 text-gray-400 border border-white/5 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 text-white shadow-purple-600/30 hover:shadow-purple-600/50 border border-purple-400/30'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw size={15} className="animate-spin text-white" />
                <span>Beautifying...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-purple-200" />
                <span>Beautify Code</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-3.5 sm:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs sm:text-sm"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={() => setError('')} 
              className="text-rose-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editors Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full">
        {/* Left: Input Code Panel */}
        <div className="flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-3 transition-all duration-300 hover:border-white/20">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse flex-shrink-0" />
              <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">Input Code</h2>
              {charsCount > 0 && (
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono hidden xs:inline truncate">
                  ({linesCount}L • {charsCount}C)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white transition-all duration-200"
                title="Paste from clipboard"
              >
                {pasted ? <Check size={12} className="text-emerald-400" /> : <Clipboard size={12} />}
                <span>{pasted ? 'Pasted!' : 'Paste'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 w-full">
            <CodeEditor
              value={inputCode}
              onChange={handleInputChange}
              language={currentActiveLang}
              onBlur={handleInputBlur}
              onMouseLeave={handleInputBlur}
              height={editorHeight}
            />
          </div>
        </div>

        {/* Right: Beautified Code Panel */}
        <div className="flex flex-col bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-5 shadow-2xl space-y-3 transition-all duration-300 hover:border-white/20">
          <div className="flex items-center justify-between pb-2 border-b border-white/5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${outputCode ? 'bg-emerald-500' : 'bg-gray-600'}`} />
              <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">Beautified Code</h2>
              {outputCode && (
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 hidden xs:inline">
                  Formatted
                </span>
              )}
            </div>

            {/* Output Panel Actions: Copy & Download */}
            <div className="flex-shrink-0">
              <OutputPanel.Actions code={outputCode} language={currentActiveLang} />
            </div>
          </div>

          <div className="flex-1 w-full">
            <OutputPanel
              code={outputCode}
              language={currentActiveLang}
              height={editorHeight}
            />
          </div>
        </div>
      </div>

      {/* Info & Educational Section */}
      <div className="beautifier-info-landing mt-12 pt-8 border-t border-white/10">
        {/* Hero Section */}
        <div className="beautifier-hero">
          <h1>
            <span role="img" aria-label="lightbulb">💡</span> <span className="beautifier-gradient-text">About Code Beautifier</span>
          </h1>
          <p>
            A <strong>code beautifier</strong> is a tool that reformats and cleans up source code to make it more <strong>readable</strong>, <strong>consistent</strong>, and <strong>easier to maintain</strong>. It adjusts indentation, spacing, brackets, line breaks, and other stylistic elements according to standard coding conventions.
          </p>
        </div>

        {/* Languages Supported Section */}
        <div className="beautifier-section">
          <h2>
            <Wrench className="text-purple-400" size={24} /> <span className="beautifier-gradient-text">Languages Supported</span>
          </h2>
          <p>Our Beautifier supports the following programming and markup languages:</p>
          <div className="beautifier-languages-grid">
            <div className="beautifier-language-card">
              <h4>1. HTML Beautifier</h4>
              <ul>
                <li>Cleans up messy or minified HTML</li>
                <li>Ensures proper nesting, indentation, and tag alignment</li>
                <li>Useful for debugging broken page structure or preparing code for production</li>
              </ul>
            </div>
            <div className="beautifier-language-card">
              <h4>2. CSS Beautifier</h4>
              <ul>
                <li>Formats stylesheets with consistent indentation</li>
                <li>Groups selectors and declarations clearly</li>
                <li>Helps improve maintainability and reduce styling errors</li>
              </ul>
            </div>
            <div className="beautifier-language-card">
              <h4>3. JavaScript (JS) Beautifier</h4>
              <ul>
                <li>Fixes spacing, indentation, and line breaks in JS code</li>
                <li>Makes function bodies, loops, and conditionals easier to follow</li>
                <li>Supports ES6+ modern syntax</li>
              </ul>
            </div>
            <div className="beautifier-language-card">
              <h4>4. Java Beautifier</h4>
              <ul>
                <li>Reformats Java code with standard conventions</li>
                <li>Properly indents methods, classes, loops, etc.</li>
                <li>Makes code easier to read and navigate in large projects</li>
              </ul>
            </div>
            <div className="beautifier-language-card">
              <h4>5. JSON Beautifier</h4>
              <ul>
                <li>Pretty-prints raw or minified JSON</li>
                <li>Adds line breaks and indentation for nested objects</li>
                <li>Makes debugging or editing JSON much easier</li>
              </ul>
            </div>
            <div className="beautifier-language-card">
              <h4>6. Python Beautifier</h4>
              <ul>
                <li>Re-indents poorly formatted Python code</li>
                <li>Ensures consistent use of whitespace and blocks</li>
                <li>Uses PEP 8 and Black conventions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="beautifier-section m-0">
            <h2>
              <CheckCircle2 className="text-emerald-400" size={24} /> <span className="beautifier-gradient-text">Advantages</span>
            </h2>
            <div className="space-y-3 mt-4">
              <div className="beautifier-advantage-item"><strong>🔍 Improves readability and maintainability</strong></div>
              <div className="beautifier-advantage-item"><strong>🧼 Cleans up minified or copy-pasted code</strong></div>
              <div className="beautifier-advantage-item"><strong>🤝 Encourages consistent coding standards</strong></div>
              <div className="beautifier-advantage-item"><strong>🐛 Aids in debugging and spotting logical errors</strong></div>
              <div className="beautifier-advantage-item"><strong>⏱️ Saves time formatting code manually</strong></div>
            </div>
          </div>

          <div className="beautifier-section m-0">
            <h2>
              <XCircle className="text-rose-400" size={24} /> <span className="beautifier-gradient-text">Considerations</span>
            </h2>
            <div className="space-y-3 mt-4">
              <div className="beautifier-disadvantage-item"><strong>🚫 May differ from specific personal styling quirks</strong></div>
              <div className="beautifier-disadvantage-item"><strong>🔁 Formatting entire files may create large git diffs</strong></div>
              <div className="beautifier-disadvantage-item"><strong>🧠 Always review output for syntax correctness</strong></div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="beautifier-section">
          <h2>
            <Rocket className="text-indigo-400" size={24} /> <span className="beautifier-gradient-text">How to Use This Beautifier</span>
          </h2>
          <div className="beautifier-steps-container">
            <div className="beautifier-step">
              <div className="beautifier-step-number">1</div>
              <h4>Paste Your Code</h4>
              <p>Paste or type your code into the left editor panel</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">2</div>
              <h4>Select or Auto-Detect</h4>
              <p>Select your language or let auto-detection identify it</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">3</div>
              <h4>Click Beautify</h4>
              <p>Click "Beautify Code" to format with precision</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">4</div>
              <h4>Copy or Download</h4>
              <p>Copy formatted code or download with matching extension</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="beautifier-cta-section">
          <h2><span className="beautifier-gradient-text">Ready to Beautify Your Code?</span></h2>
          <p>Paste your messy code above and hit <strong>Beautify Code</strong>. Experience clean, readable, and professional code in seconds.</p>
          <button 
            className="beautifier-cta-button" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Start Beautifying Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Beautifier;