import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}, rules:{"camelcase": ["error", {"ignoreDestructuring": true}], "semi": ["error"]}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];