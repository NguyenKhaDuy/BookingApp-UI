import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { connectWebSocket, disconnectWebSocket } from '../utils/stompClient';
import getCookie from '../utils/getToken';

export function WebSocketProvider({ children }) {
    const initialized = useRef(false);
    const location = useLocation();

    useEffect(() => {
        const token = getCookie('token');

        if (token && !initialized.current) {
            console.log('Token found connecting WebSocket...');

            connectWebSocket(token);
            initialized.current = true;
        }

        if (!token && initialized.current) {
            console.log('No token disconnect WebSocket...');

            disconnectWebSocket();
            initialized.current = false;
        }
    }, [location.pathname]);

    return children;
}
