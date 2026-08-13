// src/utils/websocket.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let stompClient = null;
let isConnected = false;
let globalListeners = [];

const WS_URL = "http://localhost:8082/ws";
const WS_URL_RAW = "ws://192.168.1.10:8082/ws";

function isReactNative() {
  return typeof navigator !== "undefined" && navigator.product === "ReactNative";
}

export function connectWebSocket(token) {
  if (isConnected && stompClient) return stompClient;

  stompClient = new Client({
    //AUTO chọn cách connect
    webSocketFactory: () => {
      if (isReactNative()) {
        console.log("📱 Using React Native WebSocket");
        return new WebSocket(WS_URL_RAW);
      } else {
        console.log("🌐 Using SockJS (Web)");
        return new SockJS(WS_URL);
      }
    },

    connectHeaders: token
      ? { Authorization: `Bearer ${token}` }
      : {},

    reconnectDelay: 5000,

    debug: (msg) => console.log("[WS]", msg),
  });

  //FIX riêng cho React Native
  if (isReactNative()) {
    stompClient.forceBinaryWSFrames = true;
  }

  stompClient.onConnect = () => {
    isConnected = true;
    console.log("WebSocket CONNECTED");

    //SUBSCRIBE CHUNG
    stompClient.subscribe("/topic/notify", (msg) => {
      const data = JSON.parse(msg.body);
      console.log("TOPIC:", data);
      globalListeners.forEach((fn) => fn(data));
    });

    stompClient.subscribe("/user/queue/notify", (msg) => {
      const data = JSON.parse(msg.body);
      console.log("USER:", data);
      globalListeners.forEach((fn) => fn(data));
    });
  };

  stompClient.onDisconnect = () => {
    console.log("WebSocket DISCONNECTED");
    isConnected = false;
    stompClient = null;
  };

  stompClient.onStompError = (err) => {
    console.log("STOMP ERROR", err);
  };

  stompClient.activate();
  return stompClient;
}

export function disconnectWebSocket() {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    isConnected = false;
  }
}

export function addWebSocketListener(callback) {
  globalListeners.push(callback);

  return () => {
    globalListeners = globalListeners.filter((fn) => fn !== callback);
  };
}
