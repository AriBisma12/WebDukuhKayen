import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  globalIgnores([
    "dist/**",
    "node_modules/**",
    "build/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;
