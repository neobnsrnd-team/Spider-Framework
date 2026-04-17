/**
 * @file cmsBankPlugin.ts
 * @description CMS 빌더에서 페이지 저장 시 호출되는 Vite 플러그인.
 *
 * `/__cms/create-page` POST 엔드포인트를 Vite dev 서버에 등록하여
 * defaultSave.ts 의 fetch 요청을 수신하고, 다음 두 가지 작업을 수행한다:
 *   1. 생성된 JSX 코드를 페이지 파일(.tsx)로 디스크에 저장
 *   2. 라우터 파일(routes/index.tsx)에 import 문과 라우트 항목을 자동 추가
 *
 * @example
 * // demo/front/vite.config.ts
 * import { cmsBankPlugin } from '../../react-cms/src/vite-plugin/cmsBankPlugin'
 *
 * export default defineConfig({
 *   plugins: [
 *     cmsBankPlugin({
 *       routerPath: 'src/routes/index.tsx',
 *       pagesDir:   'src/pages/cms',
 *     }),
 *   ],
 * })
 */
import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

interface CreatePagePayload {
  /** 등록할 URL 경로 (예: "/my-page") */
  uri: string;
  /** codeGenerator가 생성한 페이지 소스 코드 */
  code: string;
  /** PascalCase 컴포넌트 이름 (예: "MyPage") */
  pageName: string;
}

export interface CmsBankPluginOptions {
  /**
   * 라우터 파일 경로 (프로젝트 루트 기준).
   * pageRoutes 배열과 modalRoutes 배열을 export 하는 파일이어야 한다.
   * @default "src/routes/index.tsx"
   */
  routerPath?: string;
  /**
   * 생성된 페이지 파일을 저장할 디렉토리 (프로젝트 루트 기준)
   * @default "src/pages/cms"
   */
  pagesDir?: string;
}

/**
 * 페이지 컴포넌트 파일(.tsx)을 디스크에 생성한다.
 * 코드 내 "NewPage" 함수명을 실제 컴포넌트 이름으로 치환한다.
 */
function createPageFile(pagesDir: string, pageName: string, code: string) {
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  const finalCode = code.replace(/function NewPage\(\)/, `function ${pageName}()`);
  fs.writeFileSync(path.join(pagesDir, `${pageName}.tsx`), finalCode, "utf-8");
}

/**
 * routes/index.tsx 에 import 문과 pageRoutes 항목을 삽입한다.
 *
 * 삽입 위치:
 *   - import: `export const pageRoutes` 선언 바로 위
 *   - route:  `pageRoutes` 배열 닫는 `];` 바로 앞 (modalRoutes 선언 직전)
 */
function addToRouter(
  routerFile: string,
  pageName: string,
  uri: string,
  pageImportPath: string,
) {
  let content = fs.readFileSync(routerFile, "utf-8");

  // 1. pageRoutes 선언 직전에 import 삽입
  content = content.replace(
    /\nexport const pageRoutes/,
    `\nimport ${pageName} from "${pageImportPath}";\nexport const pageRoutes`,
  );

  // URL 앞 슬래시 제거 (라우트 path에는 슬래시 없이 등록)
  const routePath = uri.startsWith("/") ? uri.slice(1) : uri;

  // 2. pageRoutes 배열 닫는 `];` 바로 앞, modalRoutes 선언 직전에 route 삽입
  content = content.replace(
    /(\n\];)\n+(export const modalRoutes)/,
    `\n  { path: "${routePath}", element: <${pageName} /> },$1\n\n$2`,
  );

  fs.writeFileSync(routerFile, content, "utf-8");
}

/**
 * CMS 빌더 페이지 저장 요청을 처리하는 Vite 플러그인.
 * Vite dev 서버에서만 동작하며 프로덕션 빌드에는 영향을 주지 않는다.
 */
export function cmsBankPlugin(options: CmsBankPluginOptions = {}): Plugin {
  let root: string;

  return {
    name: "vite-cms-page-writer",
    configResolved(config) {
      root = config.root;
    },
    configureServer(server) {
      server.middlewares.use("/__cms/create-page", (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        let body = "";
        req.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload: CreatePagePayload = JSON.parse(body);

            const routerFile = path.join(
              root,
              options.routerPath ?? "src/routes/index.tsx",
            );
            const pagesDir = path.join(
              root,
              options.pagesDir ?? "src/pages/cms",
            );

            // @/ alias는 src/ 를 가리키므로 routerFile 경로에서 /src/ 위치를 찾아 srcDir 추론
            const srcMatch = routerFile.replace(/\\/g, "/").match(/^(.*\/src)\//);
            const srcDir = srcMatch ? srcMatch[1] : path.join(root, "src");
            const relativePath = path.relative(srcDir, pagesDir).replace(/\\/g, "/");
            const pageImportPath = `@/${relativePath}/${payload.pageName}`;

            createPageFile(pagesDir, payload.pageName, payload.code);
            addToRouter(routerFile, payload.pageName, payload.uri, pageImportPath);

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
        req.on("error", () => {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Stream error" }));
        });
      });
    },
  };
}
