module.exports = {
  plugins: ["prettier"],
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: "eslint:recommended",
  parserOptions: {
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": "warn",
    "no-console": 0,
    "no-debugger": 0
  }
};
