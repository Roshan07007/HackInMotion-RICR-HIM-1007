// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    plugins: {
      "unused-imports": require("eslint-plugin-unused-imports")
    },
    rules: {
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": "off",
      "import/no-unresolved": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/immutability": "off",
      "react-hooks/static-components": "off",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/display-name": "off"
    }
  }
]);
