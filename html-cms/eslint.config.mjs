import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import security from "eslint-plugin-security";
import playwright from "eslint-plugin-playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "public/**",
      "next-env.d.ts",
    ],
  },
  // ── 보안 취약점 탐지 (SonarCloud OWASP 대체) ──
  {
    plugins: { security },
    rules: {
      // 위험한 정규표현식 (ReDoS) 감지
      "security/detect-unsafe-regex": "warn",
      // eval 사용 금지
      "security/detect-eval-with-expression": "warn",
      // 동적 require 감지
      "security/detect-non-literal-require": "warn",
      // child_process 실행 감지
      "security/detect-child-process": "warn",
      // 객체 프로토타입 오염 가능성 감지
      "security/detect-object-injection": "off",  // 오탐(false positive) 많아 비활성화
    },
  },
  {
    rules: {
      // console.log 커밋 금지 (error/warn은 허용)
      "no-console": ["warn", { allow: ["error", "warn"] }],

      // ── 코드 복잡도 (SonarCloud 코드 스멜 대체) ──
      // 함수 복잡도 제한 — 순환 복잡도 20 초과 시 경고
      "complexity": ["warn", { max: 20 }],
      // 함수 최대 줄 수 제한 — 300줄 초과 시 경고
      "max-lines-per-function": ["warn", { max: 300, skipComments: true, skipBlankLines: true }],
      // 콜백 중첩 깊이 제한
      "max-depth": ["warn", { max: 5 }],
    },
  },
  {
    // seed 스크립트는 CLI 실행용이므로 console.log 허용
    files: ["src/db/seed/**", "scripts/**"],
    rules: {
      "no-console": "off",
    },
  },
  // ── Playwright 테스트 코드 린트 ──
  {
    files: ["e2e/**/*.spec.ts", "e2e/**/*.ts"],
    ...playwright.configs["flat/recommended"],
  },
];

export default eslintConfig;
