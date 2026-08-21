from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import black
import autopep8
import jsbeautifier
import html5lib
import cssbeautifier
from io import StringIO
import sys
import re
import json
from bs4 import BeautifulSoup

router = APIRouter()

class BeautifyRequest(BaseModel):
    code: str
    language: str

class BeautifyResponse(BaseModel):
    beautified_code: str
    language: str
    success: bool
    error: Optional[str] = None

BLACK_AVAILABLE = True

class CodeBeautifier:
    @staticmethod
    def beautify_js(code: str) -> str:
        opts = jsbeautifier.default_options()
        opts.indent_size = 2
        opts.space_in_empty_paren = True
        return jsbeautifier.beautify(code, opts)

    @staticmethod
    def beautify_css(code: str) -> str:
        opts = jsbeautifier.default_options()
        opts.indent_size = 2
        opts.space_in_empty_paren = True
        beautified = jsbeautifier.beautify(code, opts)

        rules = re.split(r'([^{}]+{[^}]+})', beautified)
        formatted_rules = []

        for rule in rules:
            if not rule.strip():
                continue

            parts = rule.split('{', 1)
            if len(parts) != 2:
                formatted_rules.append(rule)
                continue

            selector = parts[0].strip()
            properties = parts[1].rstrip('}')

            prop_list = []
            for prop in properties.split(';'):
                prop = prop.strip()
                if prop:
                    prop_list.append(f'  {prop};')

            formatted_rule = f"{selector} {{\n{chr(10).join(prop_list)}\n}}"
            formatted_rules.append(formatted_rule)

        return '\n\n'.join(formatted_rules)

    @staticmethod
    def beautify_json(code: str) -> str:
        try:
            parsed = json.loads(code)
            return json.dumps(parsed, indent=2)
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON format")

    @staticmethod
    def beautify_java(code: str) -> str:
        code = re.sub(r'\s+', ' ', code)
        code = re.sub(r';\s*', ';\n', code)
        code = re.sub(r'{\s*', '{\n', code)
        code = re.sub(r'}\s*', '}\n', code)

        lines = code.split('\n')
        indent_level = 0
        beautified_lines = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            if line.startswith('}'):
                indent_level = max(0, indent_level - 1)

            beautified_lines.append('    ' * indent_level + line)

            if line.endswith('{'):
                indent_level += 1

        return '\n'.join(beautified_lines)

    @staticmethod
    def beautify_html(code: str) -> str:
        soup = BeautifulSoup(code, 'html.parser')
        return soup.prettify()

    @staticmethod
    def beautify_python(code: str) -> str:
        """Beautify Python code with proper indentation and structure, including nested blocks, and use isort, autopep8, YAPF, and black for formatting."""
        code = code.strip()
        # Step 0: Use isort to sort imports first
        try:
            import isort
            code = isort.code(code)
        except Exception:
            pass
        # Step 1: Split by semicolons and newlines to get individual statements
        all_statements = []
        for line in code.split('\n'):
            line = line.strip()
            if not line:
                continue
            # Split by semicolon and filter out empty parts
            parts = [part.strip() for part in line.split(';') if part.strip()]
            all_statements.extend(parts)
        
        # Step 2: Process statements to handle complex structures
        processed_statements = []
        for stmt in all_statements:
            stmt = stmt.strip()
            if not stmt:
                continue
            # Handle if-elif-else chains
            if 'if ' in stmt and 'elif ' in stmt:
                if_part, elif_part = stmt.split('elif ', 1)
                processed_statements.append(if_part.strip())
                processed_statements.append('elif ' + elif_part.strip())
            elif 'if ' in stmt and 'else:' in stmt:
                if_part, else_part = stmt.split('else:', 1)
                processed_statements.append(if_part.strip())
                processed_statements.append('else:' + else_part.strip())
            elif 'elif ' in stmt and 'else:' in stmt:
                elif_part, else_part = stmt.split('else:', 1)
                processed_statements.append(elif_part.strip())
                processed_statements.append('else:' + else_part.strip())
            else:
                processed_statements.append(stmt)
        
        # Step 3: Apply proper indentation, handling nested blocks and nested defs
        indent_level = 0
        beautified_lines = []
        block_keywords = (
            'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'with', 'try', 'except', 'finally'
        )
        i = 0
        n = len(processed_statements)
        indent_stack = []
        while i < n:
            stmt = processed_statements[i].strip()
            if not stmt:
                i += 1
                continue
            # Handle block endings that decrease indentation
            if stmt.startswith(('else', 'elif', 'except', 'finally')):
                if indent_stack:
                    indent_level = indent_stack[-1]
            # Add the statement with proper indentation
            beautified_lines.append('    ' * indent_level + stmt)
            # Handle indentation changes for block headers
            if stmt.endswith(':') and stmt.split(':')[0].split('(')[0].strip().split(' ')[0] in block_keywords:
                indent_stack.append(indent_level)
                indent_level += 1
                # Collect all subsequent statements that are not block headers as part of this block
                j = i + 1
                while j < n:
                    next_stmt = processed_statements[j].strip()
                    next_keyword = next_stmt.split(':')[0].split('(')[0].strip().split(' ')[0]
                    # If next_stmt is a block header, treat as part of this block (nested block)
                    if (next_stmt.endswith(':') and next_keyword in block_keywords) or not (next_stmt.endswith(':') or next_stmt.startswith(('else', 'elif', 'except', 'finally'))):
                        beautified_lines.append('    ' * indent_level + next_stmt)
                        # If it's a block header, increase indent for its body
                        if next_stmt.endswith(':') and next_keyword in block_keywords:
                            indent_stack.append(indent_level)
                            indent_level += 1
                        j += 1
                    else:
                        break
                i = j - 1
            # If the next statement is a dedent (not part of the current block), pop the stack
            if i + 1 < n:
                next_stmt = processed_statements[i + 1].strip()
                if indent_stack and (next_stmt.startswith(('else', 'elif', 'except', 'finally')) or (not next_stmt.startswith(' ') and not next_stmt.endswith(':'))):
                    indent_level = indent_stack.pop() if indent_stack else 0
            i += 1
        result = '\n'.join(beautified_lines)
        # Step 4: Use autopep8 for formatting
        try:
            import autopep8
            result = autopep8.fix_code(result)
        except Exception:
            pass
        # Step 5: Use YAPF for formatting
        try:
            import yapf
            result, _ = yapf.yapf_api.FormatCode(result)
        except Exception:
            pass
        # Step 6: Use black for final formatting if available
        if BLACK_AVAILABLE:
            try:
                mode = black.FileMode(
                    target_versions={black.TargetVersion.PY37},
                    line_length=88,
                    string_normalization=False,
                    is_pyi=False,
                )
                result = black.format_str(result, mode=mode)
                # Clean up extra blank lines
                lines = result.split('\n')
                cleaned_lines = []
                prev_empty = False
                for line in lines:
                    if line.strip() == '':
                        if not prev_empty:
                            cleaned_lines.append(line)
                        prev_empty = True
                    else:
                        cleaned_lines.append(line)
                        prev_empty = False
                result = '\n'.join(cleaned_lines)
            except Exception:
                pass
        return result

    @staticmethod
    def detect_language(code: str) -> str:
        code = code.strip().lower()

        if re.match(r'^\s*<[^>]+>', code) or '<html' in code or '<body' in code:
            return 'html'

        try:
            json.loads(code)
            return 'json'
        except json.JSONDecodeError:
            pass

        java_patterns = [
            r'public\s+class',
            r'private\s+class',
            r'import\s+java',
            r'@Override',
            r'void\s+\w+\s*\(',
            r'int\s+\w+\s*='
        ]
        if any(re.search(pattern, code) for pattern in java_patterns):
            return 'java'

        python_patterns = [
            r'def\s+\w+\s*\(',
            r'class\s+\w+\s*:',
        ]
        if any(re.search(pattern, code) for pattern in python_patterns):
            return 'python'

        js_patterns = [
            r'function\s+\w+\s*\(',
            r'const\s+\w+\s*=',
            r'let\s+\w+\s*=',
            r'console\.log'
        ]
        if any(re.search(pattern, code) for pattern in js_patterns):
            return 'js'

        css_patterns = [
            r'{[^}]*}', r'@media', r'color:', r'display:', r'padding:', r'margin:'
        ]
        if any(re.search(pattern, code) for pattern in css_patterns):
            return 'css'

        return 'js'

@router.post("/beautify/", response_model=BeautifyResponse)
async def beautify_code(request: BeautifyRequest):
    """
    Beautify code based on the specified language
    """
    try:
        if not request.code.strip():
            raise HTTPException(status_code=400, detail="Code cannot be empty")
        
        language = request.language.lower()
        code = request.code
        
        if language == "python":
            beautified = CodeBeautifier.beautify_python(code)
        elif language == "javascript":
            beautified = CodeBeautifier.beautify_js(code)
        elif language == "html":
            beautified = CodeBeautifier.beautify_html(code)
        elif language == "css":
            beautified = CodeBeautifier.beautify_css(code)
        elif language == "json":
            beautified = CodeBeautifier.beautify_json(code)
        elif language == "java":
            beautified = CodeBeautifier.beautify_java(code)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported language: {language}")
        
        return BeautifyResponse(
            beautified_code=beautified,
            language=language,
            success=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        return BeautifyResponse(
            beautified_code=request.code,
            language=request.language,
            success=False,
            error=str(e)
        ) 