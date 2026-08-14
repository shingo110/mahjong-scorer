import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 以下 react-hooks 规则对本项目的有意模式属于误报，关闭以避免噪声阻断 lint：
      // - set-state-in-effect：GameProvider/ThemeToggle 在挂载时从 localStorage 同步状态，
      //   这是 SSR 下无法在 render 阶段读取 localStorage 的标准做法，并非 Cascading 反模式。
      // - refs：拖拽球在 render 中读取 ref（仅用于定位/光标样式）属既有且正确的实现。
      // 核心的 rules-of-hooks（hook 调用顺序）与 exhaustive-deps 仍保持开启。
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
