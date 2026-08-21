import React, { useState } from 'react';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
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

const Beautifier = () => {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');

  // Function to detect language based on code content
  const detectLanguage = (code) => {
    if (!code.trim()) return 'auto';
    const trimmedCode = code.trim();
    if (trimmedCode.startsWith('{') && trimmedCode.endsWith('}')) {
      try {
        JSON.parse(trimmedCode);
        return 'json';
      } catch (e) {}
    }
    if (trimmedCode.includes('<html') || 
        trimmedCode.includes('<!DOCTYPE') || 
        trimmedCode.includes('<head') || 
        trimmedCode.includes('<body') ||
        (trimmedCode.includes('<') && trimmedCode.includes('>') && trimmedCode.includes('</'))) {
      return 'html';
    }
    if (trimmedCode.includes('public class') || 
        trimmedCode.includes('public static void main') ||
        trimmedCode.includes('import java.') ||
        trimmedCode.includes('System.out.println') ||
        trimmedCode.includes('String[] args')) {
      return 'java';
    }
    if (trimmedCode.includes('def ') || 
        trimmedCode.includes('class ') ||
        trimmedCode.includes('import ') ||
        trimmedCode.includes('from ') ||
        trimmedCode.includes('print(') ||
        trimmedCode.includes('if __name__') ||
        trimmedCode.includes('elif ') ||
        trimmedCode.includes('except ') ||
        trimmedCode.includes('finally:') ||
        trimmedCode.includes('with ') ||
        trimmedCode.includes('for ') ||
        trimmedCode.includes('while ') ||
        trimmedCode.includes('try:') ||
        trimmedCode.includes('raise ') ||
        trimmedCode.includes('assert ') ||
        trimmedCode.includes('lambda ') ||
        trimmedCode.includes('self.') ||
        trimmedCode.includes('super(') ||
        trimmedCode.includes('open(') ||
        trimmedCode.includes('json.') ||
        trimmedCode.includes('requests.') ||
        trimmedCode.includes('os.') ||
        trimmedCode.includes('sys.') ||
        trimmedCode.includes('re.') ||
        trimmedCode.includes('datetime.') ||
        trimmedCode.includes('collections.') ||
        trimmedCode.includes('itertools.') ||
        trimmedCode.includes('functools.') ||
        trimmedCode.includes('typing.') ||
        trimmedCode.includes('pathlib.') ||
        trimmedCode.includes('argparse.') ||
        trimmedCode.includes('logging.') ||
        trimmedCode.includes('unittest.') ||
        trimmedCode.includes('pytest.') ||
        trimmedCode.includes('numpy.') ||
        trimmedCode.includes('pandas.') ||
        trimmedCode.includes('matplotlib.') ||
        trimmedCode.includes('seaborn.') ||
        trimmedCode.includes('scikit-learn') ||
        trimmedCode.includes('tensorflow.') ||
        trimmedCode.includes('torch.') ||
        trimmedCode.includes('flask.') ||
        trimmedCode.includes('django.') ||
        trimmedCode.includes('fastapi.') ||
        trimmedCode.includes('uvicorn.') ||
        trimmedCode.includes('pydantic.') ||
        trimmedCode.includes('sqlalchemy.') ||
        trimmedCode.includes('async def') ||
        trimmedCode.includes('await ') ||
        trimmedCode.includes('asyncio.') ||
        trimmedCode.includes('aiohttp.') ||
        trimmedCode.includes('async with') ||
        trimmedCode.includes('async for')) {
      return 'python';
    }
    if (trimmedCode.includes('{') && trimmedCode.includes('}') && 
        (trimmedCode.includes(':') || trimmedCode.includes(';')) &&
        !trimmedCode.includes('function') && 
        !trimmedCode.includes('var ') && 
        !trimmedCode.includes('let ') && 
        !trimmedCode.includes('const ') &&
        !trimmedCode.includes('console.log') &&
        !trimmedCode.includes('if(') &&
        !trimmedCode.includes('for(') &&
        !trimmedCode.includes('while(')) {
      return 'css';
    }
    if (trimmedCode.includes('function') || 
        trimmedCode.includes('var ') || 
        trimmedCode.includes('let ') || 
        trimmedCode.includes('const ') ||
        trimmedCode.includes('console.log') ||
        trimmedCode.includes('if(') ||
        trimmedCode.includes('for(') ||
        trimmedCode.includes('while(') ||
        trimmedCode.includes('=>') ||
        trimmedCode.includes('()') ||
        trimmedCode.includes('{}')) {
      return 'js';
    }
    return 'auto';
  };

  const handleInputChange = (value) => {
    setInputCode(value);
    setSelectedLanguage('auto');
    setDetectedLanguage('');
  };

  const handleInputBlur = () => {
    if (inputCode.trim()) {
      const detected = detectLanguage(inputCode);
      if (detected !== 'auto') {
        setDetectedLanguage(detected);
        setSelectedLanguage(detected);
      }
    }
  };

  const beautifyCode = async () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to beautify');
      return;
    }
    setLoading(true);
    setError('');
    setDetectedLanguage('');
    try {
      // Always use the /api/beautify/ endpoint
      let languageToSend = selectedLanguage;
      if (selectedLanguage === 'auto') {
        languageToSend = detectLanguage(inputCode);
      }
      // Map frontend codes to backend expected values
      const langMap = {
        js: 'javascript',
        python: 'python',
        html: 'html',
        css: 'css',
        json: 'json',
        java: 'java',
      };
      languageToSend = langMap[languageToSend] || languageToSend;
      const endpoint = 'http://localhost:8000/api/beautify/';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: inputCode, language: languageToSend }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to beautify code');
      }
      setOutputCode(data.beautified_code);
      if (data.language) {
        setDetectedLanguage(data.language);
        if (selectedLanguage === 'auto') {
          setSelectedLanguage(data.language);
        }
      } else {
        setDetectedLanguage(selectedLanguage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageDisplayName = (langCode) => {
    const lang = languages.find(l => l.value === langCode);
    return lang ? lang.label : langCode.toUpperCase();
  };

  return (
    <div className="beautifier-page beautifier-fadein-up">
      <header className="beautifier-header">
        <h1>Beautifier</h1>
        <p>Beautify your code with elegant precision</p>
      </header>
      <main className="beautifier-main">
        <div className="language-selector">
          <label htmlFor="language">Select Language:</label>
          <select
            id="language"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
                {detectedLanguage === lang.value && selectedLanguage === 'auto' ? ' (detected)' : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="button-container">
          <button 
            onClick={beautifyCode} 
            disabled={loading}
            className="beautify-button"
          >
            <i className="fas fa-magic" style={{ marginRight: '0.5rem' }}></i>
            {loading ? 'Beautifying...' : 'Beautify Code'}
          </button>
        </div>
        <div className="code-panels">
          <div className="code-panel">
            <h2>Input Code</h2>
            <CodeEditor
              value={inputCode}
              onChange={handleInputChange}
              language={selectedLanguage === 'auto' ? 'plaintext' : selectedLanguage}
              onBlur={handleInputBlur}
              onMouseLeave={handleInputBlur}
            />
          </div>
          <div className="code-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0 }}>
                Beautified Code
                {outputCode && (
                  <span style={{ fontSize: '0.8rem', color: '#00bcd4', fontWeight: 400, marginLeft: '0.5rem' }}>
                    ({getLanguageDisplayName(detectedLanguage || selectedLanguage)})
                  </span>
                )}
              </h2>
              {outputCode && (
                <div className="output-actions">
                  <OutputPanel.Actions code={outputCode} language={detectedLanguage || selectedLanguage} />
                </div>
              )}
            </div>
            <OutputPanel
              code={outputCode}
              language={detectedLanguage || selectedLanguage}
              hideActions={true}
            />
          </div>
        </div>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </main>
      {/* BEGIN: Info Section (from user HTML) */}
      <div className="beautifier-info-landing">
        {/* Hero Section */}
        <div className="beautifier-hero">
          <h1><span role="img" aria-label="lightbulb">💡</span> <span className="beautifier-gradient-text">Code Beautifier</span></h1>
          <p>A <strong>code beautifier</strong> is a tool that reformats and cleans up source code to make it more <strong>readable</strong>, <strong>consistent</strong>, and <strong>easier to maintain</strong>. It adjusts indentation, spacing, brackets, line breaks, and other stylistic elements according to standard or custom coding conventions.</p>
        </div>
        {/* Languages Supported Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="wrench">🔧</span> <span className="beautifier-gradient-text">Languages Supported</span></h2>
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
                <li>Makes code easier to read and navigate, especially in large projects</li>
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
                <li>Works with functions, classes, lists, dictionaries, etc.</li>
              </ul>
            </div>
          </div>
        </div>
        {/* History Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="history">🕰️</span> <span className="beautifier-gradient-text">A Brief History of Code Beautifiers</span></h2>
          <p>The concept of beautifying code dates back to the 1960s and 70s with the rise of structured programming. As programming languages evolved, so did the need for automated formatting. Early tools like <strong>PrettyPrinter</strong> for C and <strong>indent</strong> became standard in developer workflows. Today, modern beautifiers support dozens of languages and are integrated into most code editors and web tools — helping developers write cleaner code faster.</p>
        </div>
        {/* Advantages Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="check">✅</span> <span className="beautifier-gradient-text">Advantages of Using a Beautifier</span></h2>
          <div className="beautifier-advantages-grid">
            <div className="beautifier-advantage-item">
              <strong>🔍 Improves readability and maintainability</strong>
            </div>
            <div className="beautifier-advantage-item">
              <strong>🧼 Cleans up minified or copy-pasted code</strong>
            </div>
            <div className="beautifier-advantage-item">
              <strong>🤝 Encourages consistent coding standards in teams</strong>
            </div>
            <div className="beautifier-advantage-item">
              <strong>🐛 Aids in debugging and spotting logical errors</strong>
            </div>
            <div className="beautifier-advantage-item">
              <strong>⏱️ Saves time formatting code manually</strong>
            </div>
          </div>
        </div>
        {/* Disadvantages Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="cross">❌</span> <span className="beautifier-gradient-text">Disadvantages to Consider</span></h2>
          <div className="beautifier-advantages-grid">
            <div className="beautifier-disadvantage-item">
              <strong>🚫 May not always follow your personal/team styling preference</strong>
            </div>
            <div className="beautifier-disadvantage-item">
              <strong>🔁 Over-formatting may make diffs harder in version control</strong>
            </div>
            <div className="beautifier-disadvantage-item">
              <strong>🧠 Can reduce reliance on writing readable code manually</strong>
            </div>
          </div>
        </div>
        {/* How to Use Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="rocket">🚀</span> <span className="beautifier-gradient-text">How to Use This Beautifier</span></h2>
          <div className="beautifier-steps-container">
            <div className="beautifier-step">
              <div className="beautifier-step-number">1</div>
              <h4>Paste Your Code</h4>
              <p>Paste your code into the input editor</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">2</div>
              <h4>Auto Detection</h4>
              <p>The tool will automatically detect the programming language</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">3</div>
              <h4>Click Beautify</h4>
              <p>Click the "Beautify" button to process your code</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">4</div>
              <h4>Get Results</h4>
              <p>Your beautified code will be displayed instantly</p>
            </div>
            <div className="beautifier-step">
              <div className="beautifier-step-number">5</div>
              <h4>Copy or Download</h4>
              <p>📋 Copy to clipboard or 💾 Download as a file</p>
            </div>
          </div>
          <div style={{marginTop: '30px', padding: '20px', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '10px', borderLeft: '4px solid #667eea'}}>
            <strong>💡 Tip:</strong> File is downloaded in the correct extension based on the detected programming language.
          </div>
        </div>
        {/* Advanced Tips Section */}
        <div className="beautifier-section">
          <h2><span role="img" aria-label="brain">🧠</span> <span className="beautifier-gradient-text">Advanced Tips for Power Users</span></h2>
          <div className="beautifier-tips-list">
            <div className="beautifier-tip-item">
              <strong>🪄 Use this tool as a quick pre-commit formatter before pushing to Git</strong>
            </div>
            <div className="beautifier-tip-item">
              <strong>🔎 Combine with a linter to detect code issues along with beautifying</strong>
            </div>
            <div className="beautifier-tip-item">
              <strong>🔁 You can re-beautify multiple times to test different formatting outcomes</strong>
            </div>
            <div className="beautifier-tip-item">
              <strong>📄 Save the beautified code locally or copy it directly into your IDE</strong>
            </div>
            <div className="beautifier-tip-item">
              <strong>⚙️ Future updates may include custom styling options and real-time formatting</strong>
            </div>
          </div>
        </div>
        {/* Call to Action Section */}
        <div className="beautifier-cta-section">
          <h2><span role="img" aria-label="megaphone">📣</span> <span className="beautifier-gradient-text">Ready to Beautify Your Code?</span></h2>
          <p>Try it now! Paste your messy or unformatted code in the editor above and hit <strong>Beautify</strong>. Experience the power of clean, readable, and professional code in seconds.</p>
          <button className="beautifier-cta-button" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Start Beautifying Now</button>
          <div style={{marginTop: '30px'}}>
            <h3 className="beautifier-gradient-text">✨ Beautify. Copy. Download. Deliver.</h3>
          </div>
        </div>
      </div>
      {/* END: Info Section */}
    </div>
  );
};

export default Beautifier; 