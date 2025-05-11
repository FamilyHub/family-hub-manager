'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { useState } from 'react';
import { User } from '@/services/userService';

// Import components with no SSR to prevent hydration mismatches
const UserList = dynamic(() => import('@/components/chat/UserList'), {
  ssr: false,
  loading: () => (
    <div className="p-4">
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="rounded-full bg-gray-700 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
});

const EnhancedChatInterface = dynamic(() => 
  import('@/components/chat/EnhancedChatInterface').then(mod => mod.EnhancedChatInterface), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
});

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  reactions?: { emoji: string; count: number }[];
}

interface ChatThread {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar: string;
  isOnline: boolean;
}

const defaultThreads: ChatThread[] = [
  {
    id: 1,
    name: "Family Group",
    lastMessage: "Welcome to Family Chat!",
    timestamp: new Date(),
    unreadCount: 0,
    avatar: "👨‍👩‍👧‍👦",
    isOnline: true
  }
];

const messages: ChatMessage[] = [
  {
    id: 1,
    sender: "System",
    content: "Welcome to Family Chat!",
    timestamp: new Date(),
    isRead: true,
  }
];

const ChatPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleSendMessage = (message: string, image?: string) => {
    console.log('Sending message:', message, image);
  };

  return (
    <div className="flex h-screen bg-[#1e2632]">
      {/* Left sidebar */}
      <div className="w-80 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-white">Family Chat</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-yellow-400 p-2 rounded-lg hover:bg-[#2c3544] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-[#2c3544] text-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        
        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          <UserList onSelectUser={setSelectedUser} />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1">
        <EnhancedChatInterface
          selectedUser={selectedUser}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default ChatPage; 