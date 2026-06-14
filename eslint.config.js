import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
    {
        ignores: ["dist/", "node_modules/", "vite.config.ts"],
    },

    {
        files: ["**/*.{js,ts}"],
        extends: [
            js.configs.recommended, // Standard JS rules
            ...tseslint.configs.recommended, // Standard TS rules
        ],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser, // Enables 'window', 'document', etc.
                ...globals.node, // Enables Node globals if needed
            },
        },
    },
);
