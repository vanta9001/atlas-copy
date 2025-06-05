import { useState, useEffect, useRef, useCallback } from 'react';
import type { OnlineUser, ChatMessage, CollaborationState } from '@/types/ide';

export function useCollaboration(projectId?: number, currentUser?: { id: number; username: string }) {
  const [state, setState] = useState<CollaborationState>({
    onlineUsers: [],
    chatMessages: [],
    isConnected: false,
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const messageQueueRef = useRef<any[]>([]);

  const connect = useCallback(() => {
    if (!projectId || !currentUser) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setState(prev => ({ ...prev, isConnected: true }));
        
        // Send join message
        ws.send(JSON.stringify({
          type: 'user_join',
          projectId,
          user: currentUser,
          timestamp: new Date().toISOString(),
        }));

        // Send queued messages
        while (messageQueueRef.current.length > 0) {
          const queuedMessage = messageQueueRef.current.shift();
          ws.send(JSON.stringify(queuedMessage));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setState(prev => ({ ...prev, isConnected: false }));
        wsRef.current = null;
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [projectId, currentUser]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!currentUser || !projectId) return;

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      message,
      timestamp: new Date(),
    };

    const wsMessage = {
      type: 'chat_message',
      projectId,
      data: chatMessage,
      timestamp: new Date().toISOString(),
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(wsMessage));
    } else {
      messageQueueRef.current.push(wsMessage);
    }

    // Add to local state immediately for better UX
    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, chatMessage],
    }));
  }, [currentUser, projectId]);

  const sendCursorUpdate = useCallback((line: number, column: number) => {
    if (!currentUser || !projectId) return;

    const wsMessage = {
      type: 'cursor_update',
      projectId,
      userId: currentUser.id,
      cursor: { line, column },
      timestamp: new Date().toISOString(),
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(wsMessage));
    }
  }, [currentUser, projectId]);

  const sendCodeChange = useCallback((filePath: string, content: string, changes: any) => {
    if (!currentUser || !projectId) return;

    const wsMessage = {
      type: 'code_change',
      projectId,
      userId: currentUser.id,
      filePath,
      content,
      changes,
      timestamp: new Date().toISOString(),
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(wsMessage));
    }
  }, [currentUser, projectId]);

  const handleWebSocketMessage = useCallback((data: any) => {
    switch (data.type) {
      case 'user_join':
        setState(prev => ({
          ...prev,
          onlineUsers: [
            ...prev.onlineUsers.filter(u => u.id !== data.user.id),
            { ...data.user, status: 'online' as const }
          ],
        }));
        break;

      case 'user_leave':
        setState(prev => ({
          ...prev,
          onlineUsers: prev.onlineUsers.filter(u => u.id !== data.userId),
        }));
        break;

      case 'chat_message':
        // Don't add our own messages again
        if (data.data.userId !== currentUser?.id) {
          setState(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, data.data],
          }));
        }
        break;

      case 'cursor_update':
        if (data.userId !== currentUser?.id) {
          setState(prev => ({
            ...prev,
            onlineUsers: prev.onlineUsers.map(u => 
              u.id === data.userId 
                ? { ...u, cursor: data.cursor }
                : u
            ),
          }));
        }
        break;

      case 'code_change':
        // Handle real-time code changes from other users
        if (data.userId !== currentUser?.id) {
          // This would trigger editor updates in a real implementation
          console.log('Code change from user:', data.userId, data.filePath);
        }
        break;

      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }, [currentUser]);

  // Connect when component mounts or dependencies change
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    sendMessage,
    sendCursorUpdate,
    sendCodeChange,
    connect,
    disconnect,
  };
}

// Mock implementation for demonstration
export function useMockCollaboration() {
  const [state, setState] = useState<CollaborationState>({
    onlineUsers: [
      {
        id: 1,
        username: 'John Doe',
        email: 'john@example.com',
        status: 'online',
      },
      {
        id: 2,
        username: 'Sarah Miller',
        email: 'sarah@example.com', 
        status: 'online',
      },
      {
        id: 3,
        username: 'David Lee',
        email: 'david@example.com',
        status: 'away',
      },
    ],
    chatMessages: [
      {
        id: '1',
        userId: 2,
        username: 'Sarah Miller',
        message: 'Working on the API endpoints',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      },
      {
        id: '2',
        userId: 3,
        username: 'David Lee',
        message: 'Great! I\'ll handle the frontend',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      },
    ],
    isConnected: true,
  });

  const sendMessage = useCallback((message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: 999, // Current user mock ID
      username: 'You',
      message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      chatMessages: [...prev.chatMessages, newMessage],
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    sendCursorUpdate: () => {},
    sendCodeChange: () => {},
    connect: () => {},
    disconnect: () => {},
  };
}
