import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import stylisticJsx from "@stylistic/eslint-plugin-jsx";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "@stylistic/ts": stylisticTs,
      "@stylistic/jsx": stylisticJsx
    },
    rules: {
      semi: ["warn", "always"],
      "@stylistic/ts/indent": ["error", 2],
      "@stylistic/jsx/jsx-indent": ["error", 2],
      "@stylistic/ts/quotes": ["error", "double", { "avoidEscape": true }]
    },
  },
];

export default eslintConfig;
