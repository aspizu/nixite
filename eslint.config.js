// @ts-check
import eslint from "@eslint/js"
import banRelativeImports from "eslint-plugin-ban-relative-imports"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config([
    {ignores: ["dist"]},
    {
        extends: [eslint.configs.recommended, tseslint.configs.recommended],
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            "ban-relative-imports": banRelativeImports,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactRefresh.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "ban-relative-imports/ban-relative-imports": "error",
            "func-style": ["error", "declaration"],
        },
    },
])
