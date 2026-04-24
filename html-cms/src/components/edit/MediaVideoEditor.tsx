// src/components/edit/MediaVideoEditor.tsx
// media-video 블록의 유튜브 URL을 변경하는 편집 모달
// blockEl: HTMLElement — 대상 media-video 루트 요소 (DOM 직접 조작, ContentBuilder 저장 시 읽음)

'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

// 유튜브 URL에서 영상 ID 추출 (watch?v=, youtu.be/, embed/ 형식 모두 지원)
function parseYoutubeId(url: string): string | null {
    return url.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] ?? null;
}

export default function MediaVideoEditor({ blockEl, onClose }: Props) {
    const iframe = blockEl.querySelector<HTMLIFrameElement>('iframe');

    // 현재 iframe src에서 영상 ID 추출
    const currentId = iframe?.getAttribute('src')?.match(/embed\/([^?]+)/)?.[1] ?? '';
    const currentUrl = currentId ? `https://www.youtube.com/watch?v=${currentId}` : '';

    const [url, setUrl] = useState(currentUrl);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleApply = () => {
        const trimmed = url.trim();
        if (!trimmed) {
            setError('URL을 입력해 주세요.');
            return;
        }
        const vid = parseYoutubeId(trimmed);
        if (!vid) {
            setError('유효한 유튜브 URL이 아닙니다.');
            return;
        }
        if (iframe) {
            iframe.setAttribute('src', `https://www.youtube.com/embed/${vid}`);
        }
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleApply();
    };

    return (
        <>
            {/* 오버레이 */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99998,
                    background: 'rgba(0,0,0,0.35)',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* 패널 — ProductMenuIconEditor와 동일한 스타일 */}
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 360,
                    zIndex: 99999,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                    fontSize: 13,
                }}
            >
                {/* 헤더 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderBottom: '1px solid #f3f4f6',
                        borderRadius: '12px 12px 0 0',
                        background: '#fafafa',
                    }}
                >
                    <span style={{ fontWeight: 700, color: '#111827' }}>영상 URL 변경</span>
                    <button
                        onClick={onClose}
                        style={{
                            width: 24,
                            height: 24,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: 18,
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 본문 */}
                <div style={{ padding: '14px 14px 10px' }}>
                    <label
                        htmlFor="mv-url-input"
                        style={{ display: 'block', fontSize: 11, color: '#6b7280', marginBottom: 6, fontWeight: 600 }}
                    >
                        유튜브 URL
                    </label>
                    <div style={{ position: 'relative' }}>
                        <span
                            style={{
                                position: 'absolute',
                                left: 10,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                display: 'flex',
                                alignItems: 'center',
                                pointerEvents: 'none',
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="#FF0000">
                                <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.1c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.4 12 21.5 12 21.5s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.6 3.6-6.6 3.5z" />
                            </svg>
                        </span>
                        <input
                            id="mv-url-input"
                            ref={inputRef}
                            type="text"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setError('');
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="youtube.com/watch?v=..."
                            style={{
                                width: '100%',
                                padding: '8px 10px 8px 30px',
                                border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
                                borderRadius: 8,
                                fontSize: 13,
                                color: '#111827',
                                WebkitTextFillColor: '#111827',
                                outline: 'none',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit',
                                background: url.trim() ? '#fff' : '#f9fafb',
                            }}
                        />
                    </div>
                    {error ? (
                        <p style={{ fontSize: 11, color: '#ef4444', margin: '5px 0 0' }}>{error}</p>
                    ) : (
                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0', lineHeight: 1.6 }}>
                            watch?v=… · youtu.be/… · embed/… 형식 모두 지원
                        </p>
                    )}
                </div>

                {/* 버튼 */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 6,
                        padding: '10px 14px 14px',
                        borderTop: '1px solid #f3f4f6',
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            padding: '6px 14px',
                            border: '1px solid #e5e7eb',
                            borderRadius: 6,
                            background: '#fff',
                            fontSize: 12,
                            color: '#374151',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            padding: '6px 16px',
                            border: 'none',
                            borderRadius: 6,
                            background: '#0046A4',
                            fontSize: 12,
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 600,
                        }}
                    >
                        적용
                    </button>
                </div>
            </div>
        </>
    );
}
