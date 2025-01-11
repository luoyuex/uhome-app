// utils/WebSocketManager.js
class WebSocketManager {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this._message = null; // Use _message to store the message internally
        this.error = null;
        this.isConnecting = false;
        this.listeners = [];
        this.heartbeatInterval = null;
        this.reconnectTimeout = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.heartbeatIntervalTime = 30000; // 30 seconds
        this.reconnectDelay = 5000; // 5 seconds
        this.lastMessage = null; // Store the last received message
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
        this.lastMessage = value; // Store the last message
        this.notifyListeners({ type: 'message', payload: value });
    }

    getLastMessage() {
        return this.lastMessage;
    }

    connect(url) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log("WebSocket is already connected.");
            return;
        }
        if (this.isConnecting) {
            console.log("WebSocket is connecting.");
            return;
        }

        this.isConnecting = true;
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            this.isConnected = true;
            this.error = null;
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.notifyListeners({ type: 'open' });
            console.log("WebSocket connected");
        };

        this.socket.onmessage = (event) => {
            this.message = event.data;
        };

        this.socket.onerror = (error) => {
            this.error = error;
            this.isConnecting = false;
            this.notifyListeners({ type: 'error', payload: error });
            console.error("WebSocket error:", error);
            this.handleDisconnect();
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            this.isConnecting = false;
            this.notifyListeners({ type: 'close' });
            console.log("WebSocket disconnected");
            this.handleDisconnect();
        };
    }

    sendMessage(message, callback) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
            if (callback) {
                callback();
            }
        } else {
            console.error("WebSocket is not connected. Cannot send message:", message);
        }
    }

    closeConnection() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
        }
        this.stopHeartbeat();
        clearTimeout(this.reconnectTimeout);
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notifyListeners(event) {
        this.listeners.forEach(listener => listener(event));
    }

    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatInterval = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.sendMessage('ping');
            }
        }, this.heartbeatIntervalTime);
    }

    stopHeartbeat() {
        clearInterval(this.heartbeatInterval);
    }

    handleDisconnect() {
        this.stopHeartbeat();
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectTimeout = setTimeout(() => {
                console.log(`Attempting to reconnect WebSocket, attempt ${this.reconnectAttempts + 1}`);
                this.reconnectAttempts++;
                if (this.socket?.url) {
                    this.connect(this.socket.url);
                }
            }, this.reconnectDelay);
        } else {
            console.error("Max reconnect attempts reached. WebSocket will not reconnect.");
        }
    }
}

const webSocketManager = new WebSocketManager();
export default webSocketManager;