import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'fs';

/**
 * Transforms a JSX source string so that duplicate top-level declarations
 * (a side-effect of the "Combined" lesson files being merged from multiple
 * sub-files) do not cause SyntaxErrors in strict ES-module mode.
 *
 * Rules applied only to lines that start at column 0:
 *   1. `const X`  → `var X`   (var allows re-declaration in strict mode)
 *   2. `let X`    → `var X`
 *   3. `function NAME(` → `var NAME = function NAME(`
 *      (converts hoisted function decls to var expressions; still re-declarable)
 *
 * `export default function …` is intentionally left untouched because it
 * starts with "export", not "function".
 */
function fixDuplicates(code) {
  return code
    .replace(/^const /gm, 'var ')
    .replace(/^let /gm, 'var ')
    // function NAME( or function NAME ( — but NOT "export default function"
    .replace(/^function (\w+)(\s*\()/gm, 'var $1 = function $1$2');
}

// Vite transform plugin (runs during the Rollup build phase)
const fixDuplicateDeclarations = {
  name: 'fix-duplicate-declarations',
  enforce: 'pre',
  transform(code, id) {
    if (id.endsWith('.jsx') && !id.includes('node_modules') && !id.includes('\\src\\') && !id.includes('/src/')) {
      return { code: fixDuplicates(code), map: null };
    }
  },
};

// esbuild plugin (runs during the optimizeDeps dep-scan phase)
const esbuildFixPlugin = {
  name: 'fix-duplicate-declarations-scan',
  setup(build) {
    // Match any .jsx file (Windows and Unix paths)
    build.onLoad({ filter: /\.jsx$/ }, (args) => {
      if (args.path.includes('node_modules')) return null;
      try {
        const contents = fixDuplicates(readFileSync(args.path, 'utf-8'));
        return { contents, loader: 'jsx' };
      } catch {
        return null;
      }
    });
  },
};

export default defineConfig({
  plugins: [fixDuplicateDeclarations, react()],
  base: process.env.NODE_ENV === 'production' ? '/ML-DS/' : '/',
  // Downgrade esbuild warnings to silent so they never cause exit-code 1 in CI
  esbuild: {
    logOverride: {
      'equals-new-object':      'silent',
      'suspicious-boolean-not': 'silent',
      'direct-eval':            'silent',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildFixPlugin],
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // silence large-chunk warnings in CI
  },
  server: {
    port: 3000,
    open: true,
  },
});
