// src/utils/websocket.js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient = null;
let isConnected = false;

let globalListeners = []; // Danh sách hàm callback muốn nhận message WS

export function connectWebSocket(token = null) {
    if (isConnected && stompClient) {
        return stompClient;
    }

    const socket = new SockJS('http://localhost:8081/ws');

    stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: token ? { Authorization: 'Bearer ' + token } : {}, // 👈 CHƯA login thì KHÔNG gửi token
        debug: (str) => console.log('[WS]', str),
    });

    stompClient.onConnect = () => {
        isConnected = true;
        console.log('✅ WebSocket CONNECTED');

        // GLOBAL – ai cũng nhận
        stompClient.subscribe('/topic/notify', (msg) => {
            const data = JSON.parse(msg.body);
            globalListeners.forEach((fn) => fn(data));
        });

        // PERSONAL – chỉ khi login
        stompClient.subscribe('/user/queue/notify', (msg) => {
            const data = JSON.parse(msg.body);
            globalListeners.forEach((fn) => fn(data));
        });
    };

    stompClient.activate();
    return stompClient;
}

// Cho Home đăng ký hàm nhận thông báo
export function addWebSocketListener(callback) {
    globalListeners.push(callback);
}
