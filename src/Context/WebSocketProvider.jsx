import { useEffect, useRef } from 'react';
import { connectWebSocket, disconnectWebSocket } from '../utils/stompClient';

export function WebSocketProvider({ children }) {
    const initialized = useRef(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || initialized.current) return;

        connectWebSocket(token);
        initialized.current = true;

        return () => {
            disconnectWebSocket();
            initialized.current = false;
        };
    }, []);

    return children;
}
