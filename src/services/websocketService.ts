import { API_URL } from "../constants";
import { WebSocketMessage } from "../contexts/ChatContext";

// Типы для сообщений WebSocket
interface WebSocketMessageHandler {
  (data: WebSocketMessage): void;
}

interface WebSocketOutgoingMessage {
  type: "message" | "conversation_update";
  conversation_id?: string | number;
  text?: string;
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 3000;
  private messageHandlers: WebSocketMessageHandler[] = [];

  constructor() {
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.addMessageHandler = this.addMessageHandler.bind(this);
    this.removeMessageHandler = this.removeMessageHandler.bind(this);
  }

  connect(token: string) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    const wsUrl = `${API_URL.replace("http", "ws")}/ws/chat/?token=${token}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log("WebSocket соединение установлено");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketMessage;
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error("Ошибка при обработке сообщения:", error);
      }
    };

    this.socket.onclose = () => {
      console.log("WebSocket соединение закрыто");
      this.attemptReconnect();
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Попытка переподключения ${this.reconnectAttempts} из ${this.maxReconnectAttempts}`
      );
      setTimeout(() => {
        const token = localStorage.getItem("authToken");
        if (token) this.connect(token);
      }, this.reconnectTimeout);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendMessage(message: WebSocketOutgoingMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket не подключен");
    }
  }

  addMessageHandler(handler: WebSocketMessageHandler) {
    this.messageHandlers.push(handler);
  }

  removeMessageHandler(handler: WebSocketMessageHandler) {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
  }
}

export const websocketService = new WebSocketService();
