/* eslint.config.js - ESLint configuration (flat config format)
 *
 * ESLint is a linter - it reads your code and flags problems before you run it.
 * Think of it as a spell-checker for JavaScript: it catches bugs (unused variables,
 * calling hooks conditionally) and enforces consistent style.
 *
 * This uses the "flat config" format introduced in ESLint v9.
 * Old projects used .eslintrc.json; flat config is the current standard.
 */

// @eslint/js - the core ESLint rules for JavaScript (e.g. no-unused-vars, no-undef)
import js from '@eslint/js'

// globals - provides lists of built-in global variables per environment.
// We use globals.browser so ESLint knows window, document, fetch etc. are valid.
import globals from 'globals'

// eslint-plugin-react-hooks - enforces the Rules of Hooks:
//   - Only call hooks at the top level (not inside if/for/functions)
//   - Only call hooks from React function components or custom hooks
// Violating these causes silent, hard-to-debug bugs.
import reactHooks from 'eslint-plugin-react-hooks'

// eslint-plugin-react-refresh - warns if a component export isn't compatible
// with Vite's Hot Module Replacement (HMR). HMR lets you edit a file and see
// changes instantly without a full page reload. Exports that break HMR
// (e.g. exporting a non-component value alongside a component) get flagged.
import reactRefresh from 'eslint-plugin-react-refresh'

// defineConfig - helper that gives type hints and validates the config shape
// globalIgnores - tells ESLint to completely skip certain directories
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([

  // Skip the dist/ folder entirely - that's the compiled build output.
  // Linting generated code is pointless and slow.
  globalIgnores(['dist']),

  {
    // Apply these rules to all .js and .jsx files in the project
    files: ['**/*.{js,jsx}'],

    extends: [
      // js.configs.recommended - turns on ESLint's core recommended rules.
      // Catches things like: using a variable before declaring it,
      // duplicate case labels in switch statements, unreachable code, etc.
      js.configs.recommended,

      // reactHooks.configs.flat.recommended - enforces Rules of Hooks.
      // Example violation it catches: calling useState inside an if block.
      reactHooks.configs.flat.recommended,

      // reactRefresh.configs.vite - HMR compatibility for Vite projects.
      // Warns if your component file exports something that would break
      // fast refresh (e.g. exporting a plain object next to a component).
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      // ecmaVersion: 2020 - tells the parser which JS syntax is valid.
      // 2020 supports optional chaining (?.), nullish coalescing (??), etc.
      ecmaVersion: 2020,

      // globals.browser - declares browser globals (window, document, console,
      // setTimeout, fetch, IntersectionObserver, etc.) as known identifiers.
      // Without this, ESLint would flag them as "undefined variable" errors.
      globals: globals.browser,

      parserOptions: {
        ecmaVersion: 'latest',      // use the newest syntax the parser supports
        ecmaFeatures: { jsx: true }, // enable JSX parsing (<div>, <Component />, etc.)
        sourceType: 'module',        // files use import/export (ES modules), not require()
      },
    },

    rules: {
      // no-unused-vars - flags variables declared but never used.
      // This catches typos and dead code.
      //
      // varsIgnorePattern: '^[A-Z_]' - ignore variables that START with an
      // uppercase letter or underscore. This allows us to define component-level
      // constants like SEASONS, TABS, RESULTS_COLS without ESLint complaining
      // if they happen to only be used inside JSX (which ESLint sometimes misses).
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
