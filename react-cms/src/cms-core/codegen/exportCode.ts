/**
 * @file exportCode.ts
 * @description CMSPage → React JSX 코드 문자열 변환기.
 * 저장 포맷은 항상 JSON이며, 이 모듈은 부가 기능입니다.
 * overlays가 있는 경우 useState + open/close 핸들러 + OverlayShell을 함께 생성합니다.
 */
import type { Action, CMSPage, CMSOverlay, LayoutTemplate, OverlayTemplate, CMSCodegenConfig } from "../types";

// cms-ui LayoutRenderer 기반 코드 생성에서만 사용하는 로컬 타입 (cms-core에서 제거됨)
type LayoutProps = Record<string, unknown>;

// ─── 패딩 변환 ────────────────────────────────────────────────────────────────

/**
 * @description 픽셀 패딩 객체를 Tailwind 클래스 문자열로 변환합니다.
 * @param pd 패딩 객체 (top/right/bottom/left)
 * @returns Tailwind className 문자열
 */
function paddingToClassName(pd: { top: number; right: number; bottom: number; left: number }): string {
  const { top, right, bottom, left } = pd;
  if (!top && !right && !bottom && !left) return "";
  if (top === right && right === bottom && bottom === left) return `p-[${top}px]`;

  const parts: string[] = [];
  if (top === bottom) { if (top) parts.push(`py-[${top}px]`); }
  else { if (top) parts.push(`pt-[${top}px]`); if (bottom) parts.push(`pb-[${bottom}px]`); }
  if (left === right) { if (left) parts.push(`px-[${left}px]`); }
  else { if (right) parts.push(`pr-[${right}px]`); if (left) parts.push(`pl-[${left}px]`); }
  return parts.join(" ");
}

// ─── props 직렬화 ─────────────────────────────────────────────────────────────

/** props 없이 생성할 수 없는 컴포넌트의 필수 콜백 기본값 */
const REQUIRED_CALLBACKS: Record<string, string> = {
  TransactionFilter:            'onSearch={() => {}}',
  PinInput:                     'onComplete={() => {}}',
  LoginContainer:               'onSubmit={() => {}}',
  AlertModal:                   'open={false} onClose={() => {}}',
  ConfirmModal:                 'open={false} onClose={() => {}} onConfirm={() => {}}',
  BottomSheet:                  'open={false} onClose={() => {}}',
  TransactionFilterBottomSheet: 'open={false} onClose={() => {}}',
  AccountSelectBottomSheet:     'open={false} onClose={() => {}}',
};

/** JSX 어트리뷰트 문법: key="value" key={expr} */
function propsToStr(props: Record<string, unknown>): string {
  return Object.entries(props)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => {
      if (typeof v === "string") return `${k}="${v}"`;
      if (typeof v === "boolean") return v ? k : `${k}={false}`;
      return `${k}={${JSON.stringify(v)}}`;
    })
    .join(" ");
}

// ─── 블록 JSX 라인 생성 ───────────────────────────────────────────────────────

/**
 * @description interaction 맵의 Action을 인라인 핸들러 문자열로 변환합니다.
 * @param action Action 객체
 * @param overlays 오버레이 목록 (openOverlay 핸들러 생성에 사용)
 * @returns 인라인 핸들러 문자열 (예: "() => setAccountSheetOpen(true)")
 */
function actionToHandler(action: Action, overlayId?: string): string {
  if (action.type === "openOverlay") {
    if (!action.target) return `() => {}`;
    return `() => set${capitalize(action.target)}Open(true)`;
  }
  if (action.type === "closeOverlay") {
    if (overlayId) return `() => set${capitalize(overlayId)}Open(false)`;
    return `() => {}`;
  }
  if (action.type === "navigate") return `() => navigate("${action.path}")`;
  return "() => {}";
}

function blockToJSXLine(block: CMSPage["blocks"][number], indent: string, overlayId?: string): string {
  const { children, ...rest } = block.props ?? {};

  // interaction → 이벤트 props 자동 매핑
  const interactionEntries = Object.entries(block.interaction ?? {});
  const interactionPropsStr = interactionEntries
    .map(([key, action]) => `${key}={${actionToHandler(action, overlayId)}}`)
    .join(" ");

  const propsStr = [propsToStr(rest), REQUIRED_CALLBACKS[block.component] ?? "", interactionPropsStr]
    .filter(Boolean).join(" ");
  const openTag = `<${block.component}${propsStr ? " " + propsStr : ""}`;
  const pdCls = block.padding ? paddingToClassName(block.padding) : "";

  let jsx: string;
  if (children !== undefined) jsx = `${openTag}>${children}</${block.component}>`;
  else jsx = `${openTag} />`;

  if (pdCls) return `${indent}<div className="${pdCls}">${jsx}</div>`;
  return `${indent}<div>${jsx}</div>`;
}

// ─── Overlay 코드 생성 ────────────────────────────────────────────────────────

/**
 * @description 오버레이 하나를 실제 컴포넌트 JSX로 생성합니다.
 * template.componentName → overlay.type 순으로 컴포넌트 이름을 결정합니다.
 * overlay.blocks가 있으면 자식 블록을 감싸는 래퍼 형태로, 없으면 셀프 클로징 형태로 생성합니다.
 * @param overlay CMSOverlay 데이터
 * @param template 매칭된 OverlayTemplate (componentName 조회에 사용)
 * @returns JSX 문자열 배열
 */
function overlayToJSX(overlay: CMSOverlay, template?: OverlayTemplate): string[] {
  const varName = `${overlay.id}Open`;
  const closer = `() => set${capitalize(overlay.id)}Open(false)`;
  const componentName = template?.componentName ?? overlay.type;
  const p = overlay.props ?? {};

  // 블록이 있는 오버레이 — 자식 블록을 감싸는 래퍼 형태
  if (overlay.blocks.length > 0) {
    const blockLines = overlay.blocks.map((b) => blockToJSXLine(b, "        ", overlay.id));
    return [
      `      <${componentName} open={${varName}} onClose={${closer}}>`,
      ...blockLines,
      `      </${componentName}>`,
    ];
  }

  // props만 있는 오버레이 — overlay.props를 JSX 속성으로 직렬화
  const propEntries = Object.entries(p);
  if (propEntries.length === 0) {
    return [`      <${componentName} open={${varName}} onClose={${closer}} />`];
  }

  const propLines = propEntries.map(([k, v]) => {
    if (typeof v === "string") return `        ${k}="${v}"`;
    if (typeof v === "boolean") return v ? `        ${k}` : `        ${k}={false}`;
    return `        ${k}={${JSON.stringify(v)}}`;
  });

  return [
    `      <${componentName}`,
    `        open={${varName}}`,
    `        onClose={${closer}}`,
    ...propLines,
    `      />`,
  ];
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── generateJSX ─────────────────────────────────────────────────────────────

/**
 * @description CMSPage를 React JSX 컴포넌트 코드 문자열로 변환합니다.
 * @param page CMSPage 데이터
 * @param layouts 레이아웃 템플릿 목록 — componentName이 있으면 해당 컴포넌트로 래퍼 코드 생성
 * @param codegenConfig 전역 코드 생성 설정 (blockImportFrom, layoutImportFrom 등)
 * @param overlayTemplates 오버레이 템플릿 목록 — componentName으로 import 이름 결정
 * @returns JSX 코드 문자열
 */
export function generateJSX(
  page: CMSPage,
  layouts?: LayoutTemplate[],
  codegenConfig?: CMSCodegenConfig,
  overlayTemplates?: OverlayTemplate[],
): string {
  const { layoutType, layoutProps, blocks, overlays = [] } = page;

  // 사용된 컴포넌트 수집
  const allBlocks = [
    ...blocks,
    ...overlays.flatMap((o) => o.blocks),
  ];
  const usedTypes = [...new Set(allBlocks.map((b) => b.component))];

  // 사용된 오버레이 컴포넌트 이름 수집 (componentName 우선, 없으면 type)
  const overlayComponentTypes = [
    ...new Set(overlays.map((o) => {
      const tpl = overlayTemplates?.find((t) => t.type === o.type);
      return tpl?.componentName ?? o.type;
    })),
  ];

  const lp: LayoutProps = layoutProps ?? {};
  const blockGap = (lp.blockGap as string | undefined) ?? "none";
  const blockImportFrom = codegenConfig?.blockImportFrom ?? "@neobnsrnd-team/cms-ui";

  // 블록 JSX 라인 (페이지 레벨 블록 — overlayId 없음)
  const blockLines = blocks.map((b) => blockToJSXLine(b, "        "));

  // ── 레이아웃 래퍼 코드 생성 ────────────────────────────────────
  let layoutOpen = "";
  let layoutClose = "";
  let importLine: string;

  const blockNames = [...new Set(["Stack", ...usedTypes, ...overlayComponentTypes])];
  const currentTemplate = layouts?.find((t) => t.id === layoutType);
  const layoutComponentName = currentTemplate?.componentName;
  const layoutImportFrom = codegenConfig?.layoutImportFrom ?? blockImportFrom;

  if (layoutComponentName) {
    // ── componentName 방식: LayoutTemplate.componentName 기반 동적 생성 ──
    // blockGap은 CMS 내부 prop이므로 JSX props에서 제외
    const { blockGap: _bg, ...jsxProps } = lp;
    const propsStr = propsToStr(jsxProps);
    layoutOpen = `    <${layoutComponentName}${propsStr ? " " + propsStr : ""}>`;
    layoutClose = `    </${layoutComponentName}>`;

    if (layoutImportFrom === blockImportFrom) {
      // 같은 패키지: 하나의 import로 합침
      const allNames = [...new Set([layoutComponentName, ...blockNames])];
      importLine = `import { ${allNames.join(", ")} } from "${blockImportFrom}";`;
    } else {
      // 다른 패키지: 레이아웃 import 별도
      const layoutImportStr = `import { ${layoutComponentName} } from "${layoutImportFrom}";`;
      const blockImportStr = `import { ${blockNames.join(", ")} } from "${blockImportFrom}";`;
      importLine = [layoutImportStr, blockImportStr].join("\n");
    }
  } else {
    // componentName 미설정 — 레이아웃 래퍼 없이 블록만 렌더링
    importLine = `import { ${blockNames.join(", ")} } from "${blockImportFrom}";`;
  }

  // overlay useState 선언
  // interaction에서 참조된 openOverlay target 수집 (페이지 overlays 밖에서 참조된 것 포함)
  const interactionTargets = allBlocks
    .flatMap((b) => Object.values(b.interaction ?? {}))
    .filter((a): a is Extract<Action, { type: "openOverlay" }> => a.type === "openOverlay" && !!a.target)
    .map((a) => a.target);
  const overlayStateIds = [
    ...new Set([...overlays.map((o) => o.id), ...interactionTargets]),
  ];
  const overlayStateLines = overlayStateIds.map(
    (id) => `  const [${id}Open, set${capitalize(id)}Open] = useState(false);`,
  );

  // overlay JSX 블록
  const overlayJSXLines = overlays.flatMap((o) => {
    const tpl = overlayTemplates?.find((t) => t.type === o.type);
    return overlayToJSX(o, tpl);
  });

  // 전체 코드 조합
  // componentName이 없으면 레이아웃 래퍼를 생성할 수 없으므로 hasLayout = false
  const hasLayout = !!layoutComponentName;
  const hasOverlays = overlays.length > 0 || interactionTargets.length > 0;

  const contentLines = blockLines.length ? blockLines : ["      {/* 블록을 추가하세요 */}"];
  const stackOpen = `      <Stack${blockGap !== "none" ? ` gap="${blockGap}"` : ""}>`;
  const stackClose = `      </Stack>`;

  let body: string[];
  if (hasLayout) {
    body = ["  return (", layoutOpen, stackOpen, ...contentLines, stackClose, layoutClose, "  );"];
  } else {
    body = ["  return (", stackOpen, ...contentLines, stackClose, "  );"];
  }

  // overlay가 있으면 return 앞에 overlay JSX를 <>로 감쌈
  if (hasOverlays) {
    const returnIdx = body.findIndex((l) => l.trim() === "return (");
    body.splice(returnIdx, 1, "  return (", "    <>");
    const closingIdx = body.lastIndexOf("  );");
    body.splice(closingIdx, 1, ...overlayJSXLines, "    </>", "  );");
  }

  // navigate action 사용 여부 확인
  const allActions = [
    ...blocks.flatMap((b) => Object.values(b.interaction ?? {})),
    ...overlays.flatMap((o) => o.blocks.flatMap((b) => Object.values(b.interaction ?? {}))),
  ];
  const hasNavigate = allActions.some((a) => a.type === "navigate");

  const reactImport = hasOverlays ? 'import { useState } from "react";' : "";
  const routerImport = hasNavigate ? 'import { useNavigate } from "react-router-dom";' : "";

  // navigate 훅 선언
  const navigateHook = hasNavigate ? ["  const navigate = useNavigate();", ""] : [];

  return [
    ...(layoutComponentName ? [`// 레이아웃: ${layoutType}`, ""] : []),
    ...(reactImport ? [reactImport] : []),
    ...(routerImport ? [routerImport] : []),
    ...((reactImport || routerImport) ? [""] : []),
    importLine,
    "",
    "export default function NewPage() {",
    ...navigateHook,
    ...overlayStateLines,
    ...(overlayStateLines.length ? [""] : []),
    ...body,
    "}",
  ].join("\n");
}
