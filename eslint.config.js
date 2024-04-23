const globals = require("globals");
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        // https://eslint.org/docs/latest/use/configure/language-options#predefined-global-variables
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      semi: "error",
      "prefer-const": "error",
      "no-async-promise-executor": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
      "no-prototype-builtins": "off",
      "node/no-extraneous-require": "off",
      "node/shebang": "off",
      // https://eslint.org/docs/latest/rules/no-unused-vars
      "no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "after-used",
          caughtErrors: "none", // ignore catch block variables
          ignoreRestSiblings: false,
          reportUsedIgnorePattern: false,
        },
      ],
    },
  },
];
