import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsxArg = process.argv[2] || '1. DeepLearningClassroom.jsx';
const jsx = fs.readFileSync(path.join(__dirname, jsxArg), 'utf8');

// Parse named imports from each third-party package
const importedSymbols = {}; // { 'lucide-react': ['TrendingUp', ...], 'recharts': [...] }
const namedImportRe = /^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];?\r?\n/gm;
let m;
while ((m = namedImportRe.exec(jsx)) !== null) {
  const names = m[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]).filter(Boolean);
  const pkg = m[2];
  if (pkg !== 'react') importedSymbols[pkg] = [...(importedSymbols[pkg] || []), ...names];
}

// Strip import lines, convert export default function → function,
// remove standalone "export default Foo;" lines,
// and strip any remaining export keywords so Babel sees no ES module syntax
const body = jsx
  .replace(/^import\s[\s\S]*?from\s['"].*?['"];?\r?\n/gm, '')
  .replace(/export\s+default\s+function\b/, 'function')
  .replace(/^\s*export\s+default\s+\w+\s*;?\s*$/gm, '')
  .replace(/^export\s+(const|let|var|function|class)\b/gm, '$1')
  .replace(/^\s*export\s+\{[^}]*\}\s*;?\s*$/gm, '');

const baseName = path.basename(jsxArg, path.extname(jsxArg));
// Match either: export default function Foo  OR  export default Foo;
const compMatch = jsx.match(/export\s+default\s+function\s+(\w+)/) ||
                  jsx.match(/export\s+default\s+(\w+)\s*;/);
const compName = compMatch ? compMatch[1] : 'App';

// Build extra CDN <script> tags and JSX-preamble destructures
const extraScriptTags = [];
const jsxGlobals = ['const { useState, useEffect, useRef, useCallback, useMemo } = React;'];
const useTailwind = jsx.includes('className=');

if (importedSymbols['lucide-react']) {
  extraScriptTags.push(
    `    <script crossorigin="anonymous" src="https://unpkg.com/lucide-react@0.344.0/dist/umd/lucide-react.js"></scr` + `ipt>`
  );
  jsxGlobals.push(`const { ${[...new Set(importedSymbols['lucide-react'])].join(', ')} } = LucideReact;`);
}
if (importedSymbols['recharts']) {
  extraScriptTags.push(
    `    <script crossorigin="anonymous" src="https://unpkg.com/recharts@2.12.0/umd/Recharts.js"></scr` + `ipt>`
  );
  jsxGlobals.push(`const { ${[...new Set(importedSymbols['recharts'])].join(', ')} } = Recharts;`);
}
if (useTailwind) {
  extraScriptTags.push(`    <script src="https://cdn.tailwindcss.com"></scr` + `ipt>`);
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${baseName}</title>
    <!-- React + Babel with crossorigin so errors are not masked -->
    <script crossorigin="anonymous" src="https://unpkg.com/react@18/umd/react.development.js"></scr` + `ipt>
    <script crossorigin="anonymous" src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></scr` + `ipt>
    <script crossorigin="anonymous" src="https://unpkg.com/@babel/standalone/babel.min.js"></scr` + `ipt>
${extraScriptTags.join('\n')}
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,300;0,600;0,700;1,300;1,400&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body { margin: 0; padding: 0; background-color: #0c0f14; color: #c9d1e0; font-family: sans-serif; }
        #root { min-height: 100vh; }
        #error-overlay {
            display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.95); color: #ff6b6b; padding: 40px;
            font-family: 'JetBrains Mono', monospace; z-index: 9999;
            overflow: auto; white-space: pre-wrap;
        }
        #error-overlay h1 { color: #fff; margin-top: 0; margin-bottom: 16px; }
        #loading {
            position: fixed; top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Orbitron', sans-serif; font-size: 24px;
            color: #00d4ff; text-shadow: 0 0 10px rgba(0,212,255,0.5);
        }
    </style>
</head>
<body>
    <div id="loading">INITIALIZING ENGINE...</div>
    <div id="root"></div>
    <div id="error-overlay"><h1>&#x26A0; Render Error</h1><div id="error-message"></div></div>

    <script>
    function showError(msg) {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error-overlay').style.display = 'block';
        document.getElementById('error-message').textContent = msg;
    }
    window.onerror = function(msg, url, line, col, err) {
        showError('Error: ' + msg + '\\nURL: ' + url + '\\nLine: ' + line + ', Col: ' + col + (err ? '\\n\\n' + err.stack : ''));
        return true;
    };
    window.addEventListener('unhandledrejection', function(e) {
        showError('Unhandled Promise: ' + (e.reason ? (e.reason.stack || String(e.reason)) : String(e)));
    });
    </scr` + `ipt>

    <!-- JSX source stored as plain text so backticks / special chars are safe -->
    <script id="jsx-source" type="text/plain">
        ${jsxGlobals.join('\n        ')}

        ${body}

        const _container = document.getElementById('root');
        const _root = ReactDOM.createRoot(_container);
        _root.render(React.createElement(${compName}));
        document.getElementById('loading').style.display = 'none';
    </scr` + `ipt>

    <script>
    try {
        const src = document.getElementById('jsx-source').textContent;
        const compiled = Babel.transform(src, {
            presets: [['env', { targets: { browsers: ['last 2 Chrome versions'] }, modules: false }], 'react'],
            filename: '${baseName}.jsx'
        });
        // Use indirect eval so strict-mode globals (React, ReactDOM) are in scope
        const fn = new Function('React', 'ReactDOM', 'showError', compiled.code);
        fn(React, ReactDOM, showError);
    } catch(e) {
        showError('Babel / Compile Error:\\n' + (e.message || String(e)) + (e.stack ? '\\n\\n' + e.stack : ''));
    }
    </scr` + `ipt>
</body>
</html>`;

const outPath = path.join(__dirname, 'Interactive Pages', baseName + '-runner.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log('OK: runner written to', outPath, '(' + html.length + ' bytes)');
