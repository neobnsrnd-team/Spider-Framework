// Props 에디터 (inspector 버전)
// group / array / icon-picker / event 포함한 완전판 props 편집 UI
import { useEffect, useState } from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { Action, BlockInteraction, BlockPadding, CMSBlock, CMSOverlay } from "../types";
import type { BlockMeta, LeafPropField, PropField } from "../types";
import IconPicker, { renderLucideIcon } from "./IconPicker";

interface PropsEditorProps {
  block: CMSBlock;
  onChange: (newProps: Record<string, unknown>) => void;
  onPaddingChange: (padding: BlockPadding) => void;
  blockMeta: Record<string, BlockMeta>;
  overlays?: CMSOverlay[];
  onInteractionChange?: (interaction: BlockInteraction) => void;
}

const inputCls =
  "w-full h-8 px-3 rounded-lg border border-input-border bg-surface text-xs text-input-text outline-none focus:border-input-border-focus transition-colors";

// ── 단일 리프 필드 컨트롤 ──────────────────────────────────────────────────────
function FieldControl({
  fieldKey,
  field,
  value,
  onChange,
}: {
  fieldKey: string;
  field: LeafPropField;
  value: unknown;
  onChange: (val: unknown) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-text-secondary">
        {field.label ?? fieldKey}
      </label>

      {field.type === "string" && (
        <input
          className={inputCls}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.type === "number" && (
        <input
          type="number"
          className={inputCls}
          value={value as number}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      )}

      {field.type === "boolean" && (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative w-9 h-5 rounded-full transition-colors border-none self-start ${
            value ? "bg-primary" : "bg-border"
          }`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-card transition-all ${
              value ? "left-4" : "left-0.5"
            }`}
          />
        </button>
      )}

      {field.type === "select" && (
        <div className="flex flex-wrap gap-1.5">
          {field.options?.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                value === opt
                  ? "bg-primary/10 border-primary text-primary font-semibold"
                  : "bg-surface border-border text-text-secondary hover:bg-surface-hover"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === "icon-picker" && (
        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => setPickerOpen((o) => !o)}
            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-input-border bg-surface text-xs text-input-text hover:border-input-border-focus transition-colors"
          >
            {value
              ? renderLucideIcon(value as string, "w-4 h-4 text-primary shrink-0")
              : <span className="w-4 h-4 rounded bg-border shrink-0" />}
            <span className={`flex-1 text-left ${value ? "text-text-primary" : "text-text-muted"}`}>
              {value ? (value as string) : "아이콘 선택..."}
            </span>
            <ChevronDown
              className={`w-3 h-3 text-text-muted shrink-0 transition-transform ${pickerOpen ? "rotate-180" : ""}`}
            />
          </button>

          {pickerOpen && (
            <IconPicker
              value={value as string}
              onSelect={(name) => {
                onChange(name);
                setPickerOpen(false);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ── 이벤트 필드 (인터랙션 바인딩) ─────────────────────────────────────────────

/**
 * @description 단일 이벤트 prop에 대한 Action 바인딩 UI.
 */
function EventField({
  eventKey,
  label,
  action,
  overlays,
  onChange,
  onClear,
}: {
  eventKey: string;
  label: string;
  action?: Action;
  overlays: CMSOverlay[];
  onChange: (action: Action) => void;
  onClear: () => void;
}) {
  const actionType = action?.type ?? "none";

  // openOverlay target이 유효하지 않으면 첫 번째 오버레이로 보정
  useEffect(() => {
    if (
      action?.type === "openOverlay" &&
      overlays.length > 0 &&
      !overlays.some((o) => o.id === action.target)
    ) {
      onChange({ type: "openOverlay", target: overlays[0].id });
    }
  }, [action, overlays, onChange]);

  function handleTypeChange(type: string) {
    if (type === "none") { onClear(); return; }
    if (type === "openOverlay") onChange({ type: "openOverlay", target: overlays[0]?.id ?? "" });
    else if (type === "closeOverlay") onChange({ type: "closeOverlay" });
    else onChange({ type: "navigate", path: "/" });
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-text-secondary font-mono">{label !== eventKey ? `${eventKey} (${label})` : eventKey}</label>
        {action && (
          <button
            onClick={onClear}
            className="text-xs text-text-muted hover:text-red-400 transition-colors"
          >
            해제
          </button>
        )}
      </div>

      <select
        className={inputCls}
        value={actionType}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        <option value="none">— 없음 —</option>
        <option value="openOverlay">오버레이 열기</option>
        <option value="closeOverlay">오버레이 닫기</option>
        <option value="navigate">페이지 이동</option>
      </select>

      {actionType === "openOverlay" && (
        overlays.length === 0 ? (
          <p className="text-xs text-text-muted italic px-1">오버레이를 먼저 추가하세요</p>
        ) : (
          <select
            className={inputCls}
            value={(action as Extract<Action, { type: "openOverlay" }>).target}
            onChange={(e) => onChange({ type: "openOverlay", target: e.target.value })}
          >
            {overlays.map((o) => (
              <option key={o.id} value={o.id}>{o.type}: {o.id}</option>
            ))}
          </select>
        )
      )}

      {actionType === "navigate" && (
        <input
          type="text"
          className={inputCls}
          placeholder="/accounts"
          value={(action as Extract<Action, { type: "navigate" }>).path}
          onChange={(e) => onChange({ type: "navigate", path: e.target.value })}
        />
      )}
    </div>
  );
}

// ── 메인 PropsEditor ───────────────────────────────────────────────────────────
export default function PropsEditor({
  block,
  onChange,
  onPaddingChange,
  blockMeta,
  overlays = [],
  onInteractionChange,
}: PropsEditorProps) {
  const meta = blockMeta[block.component];
  const props = block.props ?? {};
  const padding = block.padding ?? { top: 0, right: 0, bottom: 0, left: 0 };
  const interaction = block.interaction ?? {};

  function set(key: string, value: unknown) {
    onChange({ ...props, [key]: value });
  }

  function setPadding(side: keyof BlockPadding, value: number) {
    onPaddingChange({ ...padding, [side]: Math.max(0, value) });
  }

  const schema = meta?.propSchema ?? {};
  // event 타입은 별도 이벤트 섹션에서 처리
  const valueSchema = Object.fromEntries(
    Object.entries(schema).filter(([, f]) => f.type !== "event"),
  );
  const eventSchema = Object.entries(schema).filter(([, f]) => f.type === "event");
  const hasProps = Object.keys(valueSchema).length > 0;

  return (
    <div className="flex flex-col">
      {/* ── 블록 Props ── */}
      {hasProps ? (
        <div className="px-4 py-3 flex flex-col gap-3 border-b border-border">
          {Object.entries(valueSchema).map(([key, field]: [string, PropField]) => {
            // group
            if (field.type === "group") {
              const groupVal =
                (props[key] as Record<string, unknown>) ?? field.default;
              return (
                <div key={key} className="rounded-xl border border-border overflow-hidden">
                  <div className="px-3 py-1.5 bg-surface-hover border-b border-divider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-bold text-text-secondary">
                      {field.label ?? key}
                    </span>
                  </div>
                  <div className="px-3 py-2.5 flex flex-col gap-3">
                    {Object.entries(field.fields).map(([subKey, subField]) => (
                      <FieldControl
                        key={subKey}
                        fieldKey={subKey}
                        field={subField}
                        value={groupVal[subKey] ?? subField.default}
                        onChange={(val) => set(key, { ...groupVal, [subKey]: val })}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            // array
            if (field.type === "array") {
              const arrVal =
                (props[key] as Record<string, unknown>[]) ?? field.default;
              const newItem = Object.fromEntries(
                Object.entries(field.itemFields).map(([k, f]) => [k, f.default]),
              );
              return (
                <div key={key} className="rounded-xl border border-border overflow-hidden">
                  <div className="px-3 py-1.5 bg-surface-hover border-b border-divider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-xs font-bold text-text-secondary flex-1">
                      {field.label ?? key}
                    </span>
                    <span className="text-xs text-text-muted mr-1">{arrVal.length}개</span>
                    <button
                      type="button"
                      onClick={() => set(key, [...arrVal, newItem])}
                      className="flex items-center gap-0.5 text-xs text-primary font-semibold hover:opacity-70 bg-transparent border-none"
                    >
                      <Plus className="w-3 h-3" />
                      추가
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {arrVal.length === 0 && (
                      <p className="px-3 py-2.5 text-xs text-text-muted">항목이 없습니다.</p>
                    )}
                    {arrVal.map((item, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-2.5 flex flex-col gap-2 ${idx > 0 ? "border-t border-divider" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-text-muted">#{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => set(key, arrVal.filter((_, i) => i !== idx))}
                            className="flex items-center gap-0.5 text-xs text-error hover:opacity-70 bg-transparent border-none"
                          >
                            <Trash2 className="w-3 h-3" />
                            삭제
                          </button>
                        </div>
                        {Object.entries(field.itemFields).map(([subKey, subField]) => (
                          <FieldControl
                            key={subKey}
                            fieldKey={subKey}
                            field={subField}
                            value={(item[subKey] ?? subField.default) as unknown}
                            onChange={(val) =>
                              set(
                                key,
                                arrVal.map((it, i) =>
                                  i === idx ? { ...it, [subKey]: val } : it,
                                ),
                              )
                            }
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // leaf (group / array / event 이후 남는 경우는 LeafPropField)
            const leafField = field as LeafPropField;
            return (
              <FieldControl
                key={key}
                fieldKey={key}
                field={leafField}
                value={props[key] ?? leafField.default}
                onChange={(val) => set(key, val)}
              />
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-3 text-xs text-text-muted border-b border-border">
          {meta?.name ?? block.component} — 편집 가능한 속성이 없습니다.
        </div>
      )}

      {/* ── 이벤트 ── */}
      {eventSchema.length > 0 && onInteractionChange && (
        <div className="px-4 py-3 flex flex-col gap-3 border-b border-border">
          <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">이벤트</p>
          {eventSchema.map(([key, field]) => {
            const label = field.type === "event" ? (field.label ?? key) : key;
            return (
              <EventField
                key={key}
                eventKey={key}
                label={label}
                action={interaction[key]}
                overlays={overlays}
                onChange={(action) => {
                  onInteractionChange({ ...interaction, [key]: action });
                }}
                onClear={() => {
                  const { [key]: _removed, ...rest } = interaction;
                  onInteractionChange(rest);
                }}
              />
            );
          })}
        </div>
      )}

      {/* ── 패딩 편집 ── */}
      <div className="px-4 py-3 flex flex-col gap-2.5">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wide">패딩 (px)</p>
        <div className="grid grid-cols-2 gap-2">
          {(["top", "bottom", "left", "right"] as const).map((side) => (
            <div key={side} className="flex flex-col gap-1">
              <label className="text-xs text-text-muted">
                {{ top: "위", bottom: "아래", left: "왼쪽", right: "오른쪽" }[side]}
              </label>
              <input
                type="number"
                min={0}
                value={padding[side]}
                onChange={(e) => setPadding(side, Number(e.target.value))}
                className={inputCls}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
