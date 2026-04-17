/**
 * @file BlockPalette.tsx
 * @description 블록 팔레트 컴포넌트. 카테고리·도메인 2단계 계층으로 표시. 카테고리는 블록 목록에서 동적으로 파생됨.
 */
import { useDraggable } from "@dnd-kit/core";
import type { BlockMeta } from "../types";
import React from "react";
import { UserScopeWrapper } from "../UserScopeWrapper";

// ─── 썸네일 상수 ────────────────────────────────────────────
const INNER_W = 390;
const SCALE = 0.5;
const THUMB_H = 80;

// ─── 카테고리 / 도메인 레이블 ────────────────────────────────

/** 알려진 카테고리의 한글/영문 레이블. 없는 카테고리는 그대로 표시. */
const CATEGORY_LABEL: Record<string, string> = {
  base:      "Base",
  composite: "Composite",
  page:      "Page",
  core:      "Core",
  biz:       "Biz",
  modules:   "Modules",
  pages:     "Pages"
};

/** 알려진 도메인의 한글/영문 레이블. 없는 도메인은 그대로 표시. */
const DOMAIN_LABEL: Record<string, string> = {
  bank:     "Bank",
  card:     "Card",
  auth:     "Auth",
  home:     "Home",
  action:   "Action",
  feedback: "Feedback",
  account:  "Account",
};

/** 카테고리 정렬 우선순위 (목록에 없는 카테고리는 뒤에 순서대로 추가). */
const PREFERRED_CATEGORY_ORDER = ["base", "core", "composite", "biz", "modules", "page"];

// ─── 라이브 썸네일 ──────────────────────────────────────────

interface BlockThumbnailProps {
  type: string;
  blockRegistry: Record<string, React.ComponentType<Record<string, unknown>>>;
  blockMeta: Record<string, BlockMeta>;
}

/**
 * @description 실제 컴포넌트를 CSS scale로 축소해 썸네일로 렌더링.
 * @param type 블록 타입 문자열
 * @param blockRegistry 블록 렌더러 레지스트리
 * @param blockMeta 블록 메타 정보 맵
 * @returns React 컴포넌트 | null
 */
function BlockThumbnail({ type, blockRegistry, blockMeta }: BlockThumbnailProps) {
  const Component = blockRegistry[type];
  const meta = blockMeta[type];
  if (!Component || !meta) return null;

  return (
    <div className="w-full overflow-hidden rounded-t-xl bg-white" style={{ height: THUMB_H }}>
      <UserScopeWrapper
        style={{
          width: INNER_W,
          transform: `scale(${SCALE})`,
          transformOrigin: "top left",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Component {...(meta.defaultProps as any)} />
      </UserScopeWrapper>
    </div>
  );
}

// ─── 드래그 가능한 팔레트 아이템 ───────────────────────────

interface PaletteItemProps {
  type: string;
  name: string;
  onAdd: (type: string) => void;
  blockRegistry: Record<string, React.ComponentType<Record<string, unknown>>>;
  blockMeta: Record<string, BlockMeta>;
}

/**
 * @description 드래그 & 클릭으로 캔버스에 추가할 수 있는 팔레트 아이템.
 * @param type 블록 타입 문자열
 * @param name 표시 이름
 * @param onAdd 클릭 시 블록 추가 콜백
 * @returns React 컴포넌트
 */
export function DraggablePaletteItem({ type, name, onAdd, blockRegistry, blockMeta }: PaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette::${type}`,
    data: { type: "palette-item", blockType: type },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onAdd(type)}
      className={`rounded-xl border overflow-hidden transition-all cursor-grab active:cursor-grabbing select-none bg-white ${
        isDragging
          ? "opacity-40 border-primary ring-2 ring-primary/40"
          : "border-gray-200 hover:border-primary/50 hover:shadow-sm"
      }`}
    >
      <BlockThumbnail type={type} blockRegistry={blockRegistry} blockMeta={blockMeta} />
      <div className="px-2.5 py-1.5 border-t border-gray-100 bg-gray-50">
        <span className="text-xs font-medium text-gray-600">{name}</span>
      </div>
    </div>
  );
}

// ─── 접기/펼치기 섹션 헤더 ──────────────────────────────────

interface SectionHeaderProps {
  label: string;
  collapsed: boolean;
  onToggle: () => void;
  indent?: boolean;
}

/**
 * @description 접기/펼치기 가능한 섹션 헤더.
 * @param label 표시할 레이블
 * @param collapsed 현재 접힌 상태 여부
 * @param onToggle 토글 콜백
 * @param indent 들여쓰기 여부 (도메인 서브 섹션용)
 * @returns React 컴포넌트
 */
function SectionHeader({ label, collapsed, onToggle, indent = false }: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center justify-between w-full mb-2 group ${indent ? "pl-2" : "px-1"}`}
    >
      <p className={`font-bold uppercase tracking-widest ${indent ? "text-[9px] text-gray-400" : "text-[10px] text-gray-400"}`}>
        {label}
      </p>
      <svg
        className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

// ─── 블록 팔레트 ─────────────────────────────────────────────

interface BlockPaletteProps {
  onAdd: (type: string) => void;
  filter?: string;
  blockMeta: Record<string, BlockMeta>;
  blockRegistry: Record<string, React.ComponentType<Record<string, unknown>>>;
}

/**
 * @description 블록 팔레트. 검색 시 평탄 목록, 미검색 시 카테고리/도메인 2단계 계층으로 표시.
 * 카테고리는 전달된 blockMeta에서 동적으로 파생되며, PREFERRED_CATEGORY_ORDER 기준으로 정렬됩니다.
 * 도메인이 없는 카테고리는 단일 목록, 도메인이 있는 경우 도메인별 서브 섹션으로 표시합니다.
 * @param onAdd 블록 추가 콜백
 * @param filter 검색 필터 문자열
 * @param blockMeta 블록 메타 정보 맵
 * @param blockRegistry 블록 렌더러 레지스트리
 * @returns React 컴포넌트
 */
export function BlockPalette({ onAdd, filter, blockMeta, blockRegistry }: BlockPaletteProps) {
  const q = filter?.trim().toLowerCase() ?? "";
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({});

  const toggle = (key: string) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const allEntries = Object.entries(blockMeta);

  // ── 검색 결과 ──
  if (q) {
    const filtered = allEntries.filter(
      ([type, meta]) =>
        meta.name.toLowerCase().includes(q) || type.toLowerCase().includes(q),
    );
    if (filtered.length === 0) {
      return <p className="text-xs text-gray-400 text-center py-8">검색 결과가 없습니다</p>;
    }
    return (
      <div className="flex flex-col gap-2">
        {filtered.map(([type, meta]) => (
          <DraggablePaletteItem
            key={type}
            type={type}
            name={meta.name}
            onAdd={onAdd}
            blockMeta={blockMeta}
            blockRegistry={blockRegistry}
          />
        ))}
      </div>
    );
  }

  // ── 카테고리 목록: blockMeta에서 동적 파생 후 우선순위 순 정렬 ──
  const allCategories = [...new Set(allEntries.map(([, m]) => m.category))];
  const categories = [
    ...PREFERRED_CATEGORY_ORDER.filter((c) => allCategories.includes(c)),
    ...allCategories.filter((c) => !PREFERRED_CATEGORY_ORDER.includes(c)),
  ];

  // ── 카테고리별 계층 ──
  return (
    <div className="flex flex-col gap-5">
      {categories.map((category) => {
        const items = allEntries.filter(([, meta]) => meta.category === category);
        if (items.length === 0) return null;

        const catKey = category;
        const isCatCollapsed = collapsed[catKey] ?? false;
        // 도메인이 하나라도 있으면 도메인별 서브 섹션으로 표시
        const hasDomain = items.some(([, meta]) => !!meta.domain);

        return (
          <div key={category}>
            <SectionHeader
              label={CATEGORY_LABEL[category] ?? category}
              collapsed={isCatCollapsed}
              onToggle={() => toggle(catKey)}
            />

            {!isCatCollapsed && (
              !hasDomain
                // 도메인 없음: 단일 목록
                ? (
                  <div className="flex flex-col gap-2">
                    {items.map(([type, meta]) => (
                      <DraggablePaletteItem
                        key={type}
                        type={type}
                        name={meta.name}
                        onAdd={onAdd}
                        blockMeta={blockMeta}
                        blockRegistry={blockRegistry}
                      />
                    ))}
                  </div>
                )
                // 도메인 있음: 도메인별 서브 섹션
                : (() => {
                  const domains = [...new Set(items.map(([, meta]) => meta.domain ?? "기타"))];
                  return (
                    <div className="flex flex-col gap-4">
                      {domains.map((domain) => {
                        const domainKey = `${category}:${domain}`;
                        const isDomainCollapsed = collapsed[domainKey] ?? false;
                        const domainItems = items.filter(([, meta]) => (meta.domain ?? "기타") === domain);

                        return (
                          <div key={domain} className="pl-1">
                            <SectionHeader
                              label={DOMAIN_LABEL[domain] ?? domain}
                              collapsed={isDomainCollapsed}
                              onToggle={() => toggle(domainKey)}
                              indent
                            />
                            {!isDomainCollapsed && (
                              <div className="flex flex-col gap-2 pl-1">
                                {domainItems.map(([type, meta]) => (
                                  <DraggablePaletteItem
                                    key={type}
                                    type={type}
                                    name={meta.name}
                                    onAdd={onAdd}
                                    blockMeta={blockMeta}
                                    blockRegistry={blockRegistry}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
            )}
          </div>
        );
      })}
    </div>
  );
}
