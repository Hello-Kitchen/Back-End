import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}, rules:{"camelcase": ["error", {"ignoreDestructuring": true, allow: ["id_restaurant", "id_category"]}], "semi": ["error"]}},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
];