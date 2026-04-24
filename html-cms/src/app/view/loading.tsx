// src/app/view/loading.tsx

export default function ViewLoading() {
    return (
        <>
            <style>{`
                @keyframes view-spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#ffffff',
                    overflowY: 'auto',
                }}
            >
                <div
                    className="is-container"
                    style={{
                        maxWidth: '390px',
                        margin: '0 auto',
                        width: '100%',
                        background: '#ffffff',
                        minHeight: '700px',
                        boxShadow: '0 8px 48px rgba(0,70,164,0.10)',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                width: '48px',
                                height: '48px',
                                border: '2px solid transparent',
                                borderBottomColor: '#0046A4',
                                borderRadius: '50%',
                                animation: 'view-spin 1s linear infinite',
                                margin: '0 auto',
                            }}
                        />
                        <p style={{ marginTop: '16px', color: '#6b7280' }}>미리보기 로딩 중...</p>
                    </div>
                </div>
            </div>
        </>
    );
}
