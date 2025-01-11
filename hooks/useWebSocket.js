// hooks/useWebSocket.js
import { useState, useEffect } from 'react';
import webSocketManager from '@/utils/WebSocketManager';

const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(webSocketManager.isConnected);
  const [message, setMessage] = useState(webSocketManager.message);
  const [error, setError] = useState(webSocketManager.error);
  const [isConnecting, setIsConnecting] = useState(webSocketManager.isConnecting);
  const [hasConnected, setHasConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(webSocketManager.getLastMessage());


  useEffect(() => {
    const handleWebSocketEvent = (event) => {
      switch (event.type) {
        case 'open':
          setIsConnected(true);
          setError(null);
          setIsConnecting(false);
          webSocketManager.sendMessage(JSON.stringify({ cmd: "device/online" }));
          break;
        case 'message':
          setMessage(webSocketManager.message);
          setLastMessage(webSocketManager.getLastMessage());
          break;
        case 'error':
          setError(event.payload);
          setIsConnecting(false);
          break;
        case 'close':
          setIsConnected(false);
          setIsConnecting(false);
          break;
        default:
          break;
      }
    };

    webSocketManager.addListener(handleWebSocketEvent);

    if (url && !hasConnected) {
        webSocketManager.connect(url);
        setHasConnected(true);
    }

    return () => {
      webSocketManager.removeListener(handleWebSocketEvent);
    };
  }, [url, hasConnected]);


  const sendMessage = (message, callback) => {
    webSocketManager.sendMessage(message, callback);
  };

  const closeConnection = () => {
    webSocketManager.closeConnection();
  };

  const connect = () => {
    if (url) {
        webSocketManager.connect(url);
    }
  }

  return {
    isConnected,
    message,
    sendMessage,
    closeConnection,
    error,
    connect,
    isConnecting,
    lastMessage
  };
};

export default useWebSocket;