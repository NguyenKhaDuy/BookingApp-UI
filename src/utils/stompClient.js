// src/utils/websocket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let isConnected = false;

let globalListeners = [];

export function connectWebSocket(token = null) {
    if (isConnected && stompClient) {
        return stompClient;
    }

    const socket = new SockJS('http://localhost:8081/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: token ? { Authorization: 'Bearer ' + token } : {},
        debug: (str) => console.log('[WS]', str),
    });

    stompClient.onConnect = () => {
        isConnected = true;
        console.log('✅ WebSocket CONNECTED');

        stompClient.subscribe('/topic/notify', (msg) => {
            const data = JSON.parse(msg.body);
            globalListeners.forEach((fn) => fn(data));
        });

        stompClient.subscribe('/user/queue/notify', (msg) => {
            const data = JSON.parse(msg.body);
            globalListeners.forEach((fn) => fn(data));
        });
    };

    stompClient.activate();
    return stompClient;
}

// ✅ FIX CHÍNH Ở ĐÂY
export function addWebSocketListener(callback) {
    globalListeners.push(callback);

    // 👉 TRẢ VỀ HÀM UNSUBSCRIBE
    return () => {
        globalListeners = globalListeners.filter((fn) => fn !== callback);
    };
}
