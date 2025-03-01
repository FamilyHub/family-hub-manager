'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon, 
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';

interface ChatMessage {
  id: number;
  sender: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatThread {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  avatar: string;
}

// Sample data
const chatThreads: ChatThread[] = [
  {
    id: 1,
    name: "Mom",
    lastMessage: "Don't forget about dinner tonight!",
    timestamp: new Date(),
    unreadCount: 2,
    avatar: "👩"
  },
  {
    id: 2,
    name: "Dad",
    lastMessage: "I'll pick up the groceries",
    timestamp: new Date(),
    unreadCount: 0,
    avatar: "👨"
  },
  {
    id: 3,
    name: "Sister",
    lastMessage: "Check out this new recipe",
    timestamp: new Date(),
    unreadCount: 1,
    avatar: "👧"
  },
];

const messages: ChatMessage[] = [
  {
    id: 1,
    sender: "Mom",
    content: "Don't forget about dinner tonight!",
    timestamp: new Date(),
    isRead: true
  },
  {
    id: 2,
    sender: "You",
    content: "I'll be there! What time?",
    timestamp: new Date(),
    isRead: true
  },
  {
    id: 3,
    sender: "Mom",
    content: "7 PM. Bringing your favorite dish!",
    timestamp: new Date(),
    isRead: false
  },
];

export default function ChatPage() {
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredThreads = chatThreads.filter(thread =>
    thread.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] via-[#2d1f47] to-[#1a1c2e]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 h-[80vh] flex">
          {/* Chat List */}
          <div className="w-1/3 border-r border-white/10">
            {/* Search */}
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 text-white placeholder-white/50 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-white/50" />
              </div>
            </div>

            {/* Chat Threads */}
            <div className="overflow-y-auto h-[calc(80vh-4rem)]">
              {filteredThreads.map((thread) => (
                <motion.button
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className={`w-full p-4 flex items-start gap-4 border-b border-white/5 transition-colors ${
                    selectedThread?.id === thread.id ? 'bg-white/10' : ''
                  }`}
                >
                  <span className="text-2xl">{thread.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-white font-medium truncate">{thread.name}</h3>
                      <span className="text-xs text-white/50">
                        {thread.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm truncate">{thread.lastMessage}</p>
                  </div>
                  {thread.unreadCount > 0 && (
                    <span className="bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {thread.unreadCount}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center gap-4">
                  <span className="text-2xl">{selectedThread.avatar}</span>
                  <div>
                    <h2 className="text-white font-medium">{selectedThread.name}</h2>
                    <p className="text-white/50 text-sm">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-xl p-3 ${
                          message.sender === 'You'
                            ? 'bg-purple-500 text-white'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.sender === 'You' && (
                            <span className="text-xs opacity-70">
                              {message.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <button className="text-white/50 hover:text-white transition-colors">
                      <PaperClipIcon className="h-6 w-6" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-white/5 text-white placeholder-white/50 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button className="text-white/50 hover:text-white transition-colors">
                      <FaceSmileIcon className="h-6 w-6" />
                    </button>
                    <button className="text-white/50 hover:text-white transition-colors">
                      <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/50">
                Select a chat to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 