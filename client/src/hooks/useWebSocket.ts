import { useEffect, useRef, useState } from "react";

interface UseWebSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
}

export default function useWebSocket(): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const socket = new WebSocket(wsUrl);
      
      socket.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        socketRef.current = socket;
      };
      
      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        socketRef.current = null;
      };
      
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
      };
      
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("WebSocket message received:", message);
          
          // Handle different message types
          switch (message.type) {
            case 'chat':
              // Handle chat messages
              break;
            case 'collaboration':
              // Handle collaborative editing
              break;
            case 'file_change':
              // Handle file system changes
              break;
            default:
              console.log("Unknown message type:", message.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
  };
}
