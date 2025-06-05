import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { OnlineUser, ChatMessage } from '@/types/ide';

interface CollaborationPanelProps {
  onlineUsers: OnlineUser[];
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isConnected: boolean;
  className?: string;
}

export function CollaborationPanel({
  onlineUsers,
  chatMessages,
  onSendMessage,
  isConnected,
  className,
}: CollaborationPanelProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: OnlineUser['status']) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'busy': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusIcon = (status: OnlineUser['status']) => {
    switch (status) {
      case 'online': return 'fas fa-circle';
      case 'away': return 'fas fa-clock';
      case 'busy': return 'fas fa-do-not-enter';
      default: return 'fas fa-circle';
    }
  };

  return (
    <div className={cn('bg-[#252526] border-l border-[#3C3C3C] flex flex-col', className)}>
      {/* Panel Header */}
      <div className="px-4 py-2 border-b border-[#3C3C3C] flex items-center justify-between">
        <span className="text-sm font-medium text-[#CCCCCC]">COLLABORATION</span>
        <div className="flex items-center space-x-2">
          <div className={cn('w-2 h-2 rounded-full', isConnected ? 'bg-green-400' : 'bg-red-400')} />
          <span className="text-xs text-[#6A6A6A]">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Online Users Section */}
        <div className="p-4 border-b border-[#3C3C3C]">
          <h3 className="text-xs font-semibold text-[#6A6A6A] mb-3">
            ONLINE USERS ({onlineUsers.length})
          </h3>
          <div className="space-y-2">
            {onlineUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#252526] flex items-center justify-center',
                    getStatusColor(user.status)
                  )}>
                    <i className={cn(getStatusIcon(user.status), 'text-[6px] text-white')} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#CCCCCC] truncate">{user.username}</div>
                  <div className="text-xs text-[#6A6A6A] capitalize">{user.status}</div>
                </div>
                {user.cursor && (
                  <div className="text-xs text-[#6A6A6A]" title="Cursor position">
                    <i className="fas fa-i-cursor mr-1" />
                    {user.cursor.line}:{user.cursor.column}
                  </div>
                )}
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <div className="text-sm text-[#6A6A6A] italic">No other users online</div>
            )}
          </div>
        </div>

        {/* Chat Section */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 pb-2">
            <h3 className="text-xs font-semibold text-[#6A6A6A] mb-3">CHAT</h3>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 px-4 space-y-3 overflow-y-auto max-h-64">
            {chatMessages.map((message) => (
              <div key={message.id} className="text-xs">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="font-medium text-blue-400">{message.username}:</span>
                  <span className="text-[#6A6A6A]">{formatTime(message.timestamp)}</span>
                </div>
                <div className="text-[#CCCCCC] ml-0 break-words">{message.message}</div>
              </div>
            ))}
            {chatMessages.length === 0 && (
              <div className="text-sm text-[#6A6A6A] italic">No messages yet</div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 pt-2 border-t border-[#3C3C3C]">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#1E1E1E] border border-[#3C3C3C] rounded-l px-2 py-1 text-xs text-[#CCCCCC] focus:outline-none focus:border-[#007ACC]"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="bg-[#007ACC] px-3 py-1 rounded-r text-xs text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserCursorProps {
  user: OnlineUser;
  position: { top: number; left: number };
}

export function UserCursor({ user, position }: UserCursorProps) {
  return (
    <div
      className="absolute pointer-events-none z-10"
      style={{ top: position.top, left: position.left }}
    >
      <div className="relative">
        <div className="w-0.5 h-6 bg-blue-500 animate-pulse" />
        <div className="absolute top-0 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {user.username}
        </div>
      </div>
    </div>
  );
}

interface CollaborationSkeletonProps {
  className?: string;
}

export function CollaborationSkeleton({ className }: CollaborationSkeletonProps) {
  return (
    <div className={cn('bg-[#252526] border-l border-[#3C3C3C]', className)}>
      <div className="px-4 py-2 border-b border-[#3C3C3C]">
        <div className="w-32 h-4 bg-[#3C3C3C] rounded animate-pulse" />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <div className="w-24 h-3 bg-[#3C3C3C] rounded animate-pulse mb-3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-[#3C3C3C] rounded-full animate-pulse" />
              <div className="w-20 h-3 bg-[#3C3C3C] rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div>
          <div className="w-16 h-3 bg-[#3C3C3C] rounded animate-pulse mb-3" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="mb-3">
              <div className="w-32 h-3 bg-[#3C3C3C] rounded animate-pulse mb-1" />
              <div className="w-48 h-3 bg-[#3C3C3C] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
