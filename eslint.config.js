module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2017,
            sourceType: "script"
        },
        rules: {
            semi: "error",
            "prefer-const": "error",
            "no-async-promise-executor": 'off',
            "no-empty": ["error", { "allowEmptyCatch": true }],
            "no-prototype-builtins": 'off',
            "node/no-extraneous-require": 'off',
            "node/shebang": 'off'
        }
    }
];
