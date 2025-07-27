import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Next.js specific rules
      "@next/next/no-img-element": "off",

      // TypeScript rules - relax for development
      "@typescript-eslint/no-explicit-any": "warn", // Change from error to warning
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_", // Allow unused vars that start with _
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true
        }
      ],

      // React rules - relax for development
      "react/no-unescaped-entities": "off", // Turn off for development

      // Allow require imports for specific cases (tests, config files)
      "@typescript-eslint/no-require-imports": "warn",

      // Allow unused expressions in some contexts
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": true,
          "allowTernary": true,
          "allowTaggedTemplates": true
        }
      ],

      // React Hooks rules - keep but provide more flexibility
      "react-hooks/exhaustive-deps": "warn", // Change from error to warning

      // Prefer const - keep as warning
      "prefer-const": "warn"
    },
  },
];

export default eslintConfig;
