import { useCallback, useEffect, useRef, useState } from 'react';

export default function useToast(defaultDuration = 3200) {
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const hideToast = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
        setToastMessage(null);
    }, []);

    const showToast = useCallback(
        (message: string, duration = defaultDuration) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            setToastMessage(message);
            timerRef.current = setTimeout(() => {
                timerRef.current = null;
                setToastMessage(null);
            }, duration);
        },
        [defaultDuration],
    );

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return {
        toastMessage,
        showToast,
        hideToast,
    };
}
