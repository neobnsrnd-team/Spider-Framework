import { useState } from "react";
import type { CMSPage } from "./types";

export interface SavePageParams {
  pageName: string; // PascalCase, e.g. "MyPage"
  uri: string;      // e.g. "/my-page"
  /** CMSBuilder가 Context 정보(layouts, codegenConfig, overlayTemplates)를 포함해 사전 생성한 JSX 코드 */
  code?: string;
}

interface SavePageModalProps {
  page: CMSPage;
  onClose: () => void;
  /** 소비자가 제공하는 저장 핸들러. 생략 시 저장 버튼은 비활성 */
  onSave?: (page: CMSPage, params: SavePageParams) => void | Promise<void>;
}

function validate(params: SavePageParams): string | null {
  if (!params.pageName) return "컴포넌트명을 입력하세요.";
  if (!/^[A-Z][A-Za-z0-9]*$/.test(params.pageName))
    return "컴포넌트명은 대문자로 시작하는 영문/숫자만 사용할 수 있습니다.";
  if (!params.uri) return "라우트 경로를 입력하세요.";
  if (!params.uri.startsWith("/")) return "라우트 경로는 /로 시작해야 합니다.";
  return null;
}

export default function SavePageModal({ page, onClose, onSave }: SavePageModalProps) {
  const [pageName, setPageName] = useState("");
  const [uri, setUri] = useState("/");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    const params: SavePageParams = { pageName, uri };
    const validationError = validate(params);
    if (validationError) {
      setErrorMsg(validationError);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    try {
      if (onSave) {
        await onSave(page, params);
      }
      setStatus("success");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.");
      setStatus("error");
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-sm font-bold text-gray-900">페이지 저장</h2>

        {status === "success" ? (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-xs text-green-700">
              <p className="font-semibold mb-1">저장 완료</p>
              <p>
                <span className="font-mono">{uri}</span> 경로로 페이지가 생성되었습니다.
              </p>
              <p className="mt-1 text-green-600">
                HMR이 적용되면 브라우저에서 바로 확인할 수 있습니다.
              </p>
            </div>
            <button
              className="w-full py-2 text-xs font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              onClick={onClose}
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <Field label="컴포넌트명" hint="PascalCase (예: MyPage)">
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="MyPage"
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  disabled={status === "loading"}
                />
              </Field>

              <Field label="라우트 경로" hint="예: /my-page">
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="/my-page"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  disabled={status === "loading"}
                />
              </Field>
            </div>

            {status === "error" && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                onClick={onClose}
                disabled={status === "loading"}
              >
                취소
              </button>
              <button
                className="px-4 py-2 text-xs rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={status === "loading"}
              >
                {status === "loading" ? "저장 중…" : "저장"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{label}</span>
        <span className="text-[10px] text-gray-400">{hint}</span>
      </div>
      {children}
    </div>
  );
}
