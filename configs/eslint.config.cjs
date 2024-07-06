module.exports = [
  {
    files: ["*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    env: {
      browser: true,
      node: true,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
