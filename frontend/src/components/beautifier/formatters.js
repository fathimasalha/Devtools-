import beautify from 'js-beautify';

/**
 * Format JavaScript / TypeScript code
 */
export function formatJS(code) {
  return beautify.js(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'collapse',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: false,
    wrap_line_length: 0,
    indent_inner_html: false,
    comma_first: false,
    e4x: true,
    indent_empty_lines: false
  });
}

/**
 * Format HTML / XML code
 */
export function formatHTML(code) {
  return beautify.html(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    indent_inner_html: true,
    wrap_line_length: 0,
    extra_liners: [],
    indent_body_inner_html: true,
    indent_head_inner_html: true,
    unformatted: ['code', 'pre', 'em', 'strong', 'span']
  });
}

/**
 * Format CSS / SCSS / LESS code
 */
export function formatCSS(code) {
  return beautify.css(code, {
    indent_size: 2,
    indent_char: ' ',
    max_preserve_newlines: 2,
    preserve_newlines: true,
    newline_between_rules: true,
    selector_separator_newline: true
  });
}

/**
 * Format JSON code
 */
export function formatJSON(code) {
  try {
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed, null, 2);
  } catch (err) {
    // If parsing fails (e.g. JSON with comments or unquoted keys), fallback to js-beautify
    return beautify.js(code, {
      indent_size: 2,
      brace_style: 'collapse',
      preserve_newlines: true
    });
  }
}

/**
 * Format Java code
 */
export function formatJava(code) {
  if (!code || !code.trim()) return '';

  // Protect string literals and characters
  const strings = [];
  const placeholder = '___JAVA_STR_';
  let processed = code.replace(/(["'])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
    strings.push(match);
    return `${placeholder}${strings.length - 1}___`;
  });

  // Normalise spaces around braces and semicolons
  processed = processed
    .replace(/\r\n/g, '\n')
    .replace(/;\s*/g, ';\n')
    .replace(/\{\s*/g, '{\n')
    .replace(/\}\s*/g, '\n}\n');

  const lines = processed.split('\n');
  let indent = 0;
  const result = [];

  for (let rawLine of lines) {
    let line = rawLine.trim();
    if (!line) continue;

    const startsWithClose = /^}+/.exec(line);
    if (startsWithClose) {
      indent = Math.max(0, indent - startsWithClose[0].length);
    }

    let openCount = (line.match(/{/g) || []).length;
    let closeCount = (line.match(/}/g) || []).length;

    result.push('    '.repeat(indent) + line);

    if (openCount > (startsWithClose ? 0 : closeCount)) {
      indent += (openCount - (startsWithClose ? 0 : closeCount));
    }
  }

  let formatted = result.join('\n');

  // Restore string literals
  formatted = formatted.replace(new RegExp(`${placeholder}(\\d+)___`, 'g'), (_, idx) => {
    return strings[parseInt(idx, 10)];
  });

  try {
    return beautify.js(formatted, {
      indent_size: 4,
      preserve_newlines: true,
      max_preserve_newlines: 2,
      space_before_conditional: true,
      brace_style: 'collapse',
      space_in_empty_paren: true,
    });
  } catch (e) {
    return formatted;
  }
}

/**
 * Format Python code
 */
export function formatPython(code) {
  if (!code || !code.trim()) return '';

  const strings = [];
  const placeholder = '___PY_STR_';
  let processed = code.replace(/('''[\s\S]*?'''|"""[\s\S]*?"""|'(\\.|[^'\\])*'|"(\\.|[^"\\])*")/g, (match) => {
    strings.push(match);
    return `${placeholder}${strings.length - 1}___`;
  });

  const rawLines = processed.split('\n');
  const splitStatements = [];

  for (let rawLine of rawLines) {
    let trimmed = rawLine.trim();
    if (!trimmed) {
      splitStatements.push('');
      continue;
    }

    let parenDepth = 0;
    let bracketDepth = 0;
    let braceDepth = 0;
    let currentPart = '';

    for (let i = 0; i < trimmed.length; i++) {
      const char = trimmed[i];
      if (char === '(') parenDepth++;
      else if (char === ')') parenDepth = Math.max(0, parenDepth - 1);
      else if (char === '[') bracketDepth++;
      else if (char === ']') bracketDepth = Math.max(0, bracketDepth - 1);
      else if (char === '{') braceDepth++;
      else if (char === '}') braceDepth = Math.max(0, braceDepth - 1);

      if (char === ';' && parenDepth === 0 && bracketDepth === 0 && braceDepth === 0) {
        if (currentPart.trim()) {
          splitStatements.push(currentPart.trim());
        }
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    if (currentPart.trim()) {
      splitStatements.push(currentPart.trim());
    }
  }

  let indent = 0;
  const result = [];
  const blockStartRegex = /:\s*(#.*)?$/;
  const dedentKeywords = /^\s*(elif|else|except|finally)\b/;
  const blockKeywords = /^\s*(def|class|if|elif|else|for|while|with|try|except|finally|async\s+def|async\s+with|async\s+for)\b/;

  for (let i = 0; i < splitStatements.length; i++) {
    let stmt = splitStatements[i];
    if (!stmt) {
      result.push('');
      continue;
    }

    stmt = stmt
      .replace(/([^!=<>+\-*/%&|^~])=([^=])/g, '$1 = $2')
      .replace(/==+/g, ' == ')
      .replace(/!=/g, ' != ')
      .replace(/<=/g, ' <= ')
      .replace(/>=/g, ' >= ')
      .replace(/,\s*/g, ', ')
      .replace(/:\s*$/, ':');

    stmt = stmt.replace(/  +/g, ' ');

    if (dedentKeywords.test(stmt)) {
      indent = Math.max(0, indent - 1);
    }

    result.push('    '.repeat(indent) + stmt);

    if (blockStartRegex.test(stmt) && blockKeywords.test(stmt)) {
      indent += 1;
    }
  }

  let formatted = result.join('\n');

  formatted = formatted.replace(new RegExp(`${placeholder}(\\d+)___`, 'g'), (_, idx) => {
    return strings[parseInt(idx, 10)];
  });

  return formatted;
}

/**
 * Main beautify dispatcher
 */
export function beautifyCodeLocally(code, language) {
  const lang = (language || 'js').toLowerCase();
  switch (lang) {
    case 'html':
    case 'xml':
      return formatHTML(code);
    case 'css':
    case 'scss':
    case 'less':
      return formatCSS(code);
    case 'json':
      return formatJSON(code);
    case 'java':
      return formatJava(code);
    case 'python':
    case 'py':
      return formatPython(code);
    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
    case 'jsx':
    case 'tsx':
    default:
      return formatJS(code);
  }
}
