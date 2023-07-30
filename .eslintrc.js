module.exports = {
  env: {
    es2022: true,
  },
  rules: {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "no-unused-vars": ["error", { destructuredArrayIgnorePattern: "^_" }],
    "max-depth": ["error", 2],
    "max-params": ["error", 4],
    "complexity": ["error", 3],
    "comma-spacing": ["error"],
    "no-multi-spaces": ["error"],
    "eqeqeq": ["error"],
    "no-extra-semi": ["error"],
    "no-multi-assign": ["error"],
    "no-param-reassign": ["error"],
    "no-unused-expressions": ["error"],
    "no-use-before-define": ["error"],
    "max-statements": ["error", 10],
    "no-else-return": ["error"],
    "object-shorthand": ["error"],
    "array-callback-return": ["error", { checkForEach: true }],
    "prefer-template": ["error"],
    "func-style": ["error", "expression"],
    "prefer-rest-params": ["error"],
    "prefer-const": ["error"],
    "prefer-destructuring": ["error"],
    "id-length": ["error", { exceptions: ["a", "b", "id"], min: 3, max: 20 }],
  },
};