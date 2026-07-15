import js from "@eslint/js";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.jsx"],
    plugins: { react, "jsx-a11y": jsxA11y },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { window: "readonly", document: "readonly", localStorage: "readonly", setTimeout: "readonly", clearTimeout: "readonly", setInterval: "readonly", clearInterval: "readonly", console: "readonly", navigator: "readonly", requestAnimationFrame: "readonly", cancelAnimationFrame: "readonly", alert: "readonly", confirm: "readonly", URLSearchParams: "readonly", URL: "readonly", HTMLElement: "readonly", MediaQueryList: "readonly", matchMedia: "readonly", fetch: "readonly", AbortController: "readonly", crypto: "readonly", CustomEvent: "readonly" },
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error",
    },
    settings: { react: { version: "detect" } },
  },
  prettier,
];
