// .eslintrc.js
module.exports = {
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  env: {
    jest: true, 
    node: true,
    es6: true,
  },
  rules: {
    "no-undef": "off",
  },
};
