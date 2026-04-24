import React from 'react';

export interface ToastProps {
    message: string;
    bottom?: string;
}

export default function Toast({ message, bottom = '28px' }: ToastProps) {
    return (
        <div
            style={{
                position: 'fixed',
                left: '50%',
                bottom,
                transform: 'translateX(-50%)',
                zIndex: 320,
                maxWidth: 'min(640px, calc(100vw - 32px))',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(17,24,39,0.94)',
                color: '#ffffff',
                fontSize: '13px',
                lineHeight: 1.5,
                boxShadow: '0 12px 28px rgba(15,23,42,0.28)',
                textAlign: 'center',
                whiteSpace: 'normal',
            }}
        >
            {message}
        </div>
    );
}
