'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  FaceSmileIcon,
} from '@heroicons/react/24/outline';
import { EmojiPicker } from './EmojiPicker';
import { MessageBubble } from './MessageBubble';
import { ProfileAvatar } from './ProfileAvatar';
import { ChatOptionsMenu } from './ChatOptionsMenu';
import { TypingIndicator } from './TypingIndicator';
import { ChatMessage } from '@/services/chatService';
import { chatService } from '@/services/chatService';
import { websocketService } from '@/services/websocketService';
import { User } from '@/services/userService';
import { getUserIdFromToken } from '@/utils/auth';

interface EnhancedChatInterfaceProps {
  selectedUser: User | null;
  isDarkMode: boolean;
}

export function EnhancedChatInterface({
  selectedUser,
  isDarkMode,
}: EnhancedChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [previousCursor, setPreviousCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [hasPrevious, setHasPrevious] = useState<boolean>(false);

  // Get current userId from token
  const currentUserId = getUserIdFromToken();

  // Establish WebSocket connection when component mounts
  useEffect(() => {
    console.log('EnhancedChatInterface: Component mounted, establishing WebSocket connection');
    websocketService.connect();

    // Set up connection status listener
    const unsubscribeConnection = websocketService.onConnectionChange((connected) => {
      console.log('EnhancedChatInterface: WebSocket connection status changed:', connected);
      setIsConnected(connected);
    });

    // Cleanup on unmount
    return () => {
      console.log('EnhancedChatInterface: Component unmounting, cleaning up WebSocket connection');
      unsubscribeConnection();
      websocketService.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount

  // Handle user-specific WebSocket events when a user is selected
  useEffect(() => {
    if (selectedUser) {
      console.log('EnhancedChatInterface: User selected, setting up WebSocket event handlers for user:', selectedUser.userId);

      // Set up message listener
      const unsubscribeMessage = websocketService.onMessage((message: ChatMessage) => {
        // Filter out typing indicator messages
        if (message.content === "TYPING" || message.content === "NOT_TYPING") {
          return;
        }
        
        if (message.senderId === selectedUser.userId || message.receiverId === selectedUser.userId) {
          console.log('EnhancedChatInterface: Received message for current user:', message);
          setMessages(prevMessages => {
            // Check if message already exists to prevent duplicates
            const messageExists = prevMessages.some(msg => msg.id === message.id);
            if (messageExists) {
              return prevMessages;
            }
            const newMessages = [...prevMessages, message];
            console.log('EnhancedChatInterface: Updated messages:', newMessages);
            return newMessages;
          });
          scrollToBottom();
        }
      });

      // Set up typing indicator listener
      const unsubscribeTyping = websocketService.onTyping((userId, isTyping) => {
        if (userId === selectedUser.userId) {
          console.log('EnhancedChatInterface: Typing status changed for current user:', isTyping);
          setIsOtherTyping(isTyping);
        }
      });

      // Set up status update listener
      const unsubscribeStatus = websocketService.onStatusUpdate((messageId, status) => {
        console.log('EnhancedChatInterface: Message status updated:', messageId, status);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        ));
      });

      // Load initial messages
      console.log('EnhancedChatInterface: Loading initial messages for user:', selectedUser.userId);
      setMessages([]);
      setCursor(undefined);
      setHasMoreMessages(true);

      // Cleanup when user changes
      return () => {
        console.log('EnhancedChatInterface: User changed, cleaning up WebSocket handlers');
        unsubscribeMessage();
        unsubscribeTyping();
        unsubscribeStatus();
      };
    }
  }, [selectedUser]);

  // Load initial messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      setNextCursor(undefined);
      setPreviousCursor(undefined);
      setHasMore(false);
      setHasPrevious(false);
      setIsLoading(true);
      chatService.getMessageHistory(selectedUser.userId, { limit: 20 })
        .then(res => {
          setMessages(res.messages || []);
          setNextCursor(res.nextCursor);
          setPreviousCursor(res.previousCursor);
          setHasMore(!!res.hasMore);
          setHasPrevious(!!res.hasPrevious);
        })
        .catch(err => console.error('Error loading initial messages:', err))
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load older messages (scroll up)
  const loadOlderMessages = async () => {
    if (!selectedUser || isLoading || !hasMore || !nextCursor) return;
    setIsLoading(true);
    try {
      const res = await chatService.getMessageHistory(selectedUser.userId, { beforeTimestamp: nextCursor, limit: 20 });
      setMessages(prev => [...res.messages, ...prev]);
      setNextCursor(res.nextCursor);
      setHasMore(!!res.hasMore);
    } catch (error) {
      console.error('Error loading older messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load newer messages (scroll down)
  const loadNewerMessages = async () => {
    if (!selectedUser || isLoading || !hasPrevious || !previousCursor) return;
    setIsLoading(true);
    try {
      const res = await chatService.getMessageHistory(selectedUser.userId, { afterTimestamp: previousCursor, limit: 20 });
      setMessages(prev => [...prev, ...res.messages]);
      setPreviousCursor(res.previousCursor);
      setHasPrevious(!!res.hasPrevious);
    } catch (error) {
      console.error('Error loading newer messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    try {
      // Build the message object
      const tempId = 'temp-' + Date.now();
      const message = {
        id: tempId,
        senderId: currentUserId,
        receiverId: selectedUser.userId,
        content: newMessage,
        timestamp: new Date().toISOString(),
        status: 'SENT',
      };
      // Send via WebSocket
      websocketService.sendMessage(message);
      // Optimistically add to UI
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setShowEmojiPicker(false);
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTyping = () => {
    if (!selectedUser) return;

    setIsTyping(true);
    websocketService.sendTypingIndicator(selectedUser.userId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      websocketService.sendTypingIndicator(selectedUser.userId, false);
    }, 1000);
  };

  const handleMessageDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {selectedUser ? (
        <>
          {/* Chat Header */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ProfileAvatar
                  avatar={selectedUser.name}
                  isOnline={isConnected}
                  size="lg"
                  isDarkMode={isDarkMode}
                />
                <div>
                  <h2 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedUser.name}
                  </h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isConnected ? 'Connected' : 'Connecting...'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 relative overflow-y-auto">
            <div className="p-4 space-y-4">
              {hasMore && (
                <button
                  onClick={loadOlderMessages}
                  disabled={isLoading}
                  className={`w-full py-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {isLoading ? 'Loading...' : 'Load older messages'}
                </button>
              )}
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isSender={message.senderId === currentUserId}
                  isDarkMode={isDarkMode}
                  onDelete={handleMessageDelete}
                />
              ))}
              {hasPrevious && (
                <button
                  onClick={loadNewerMessages}
                  disabled={isLoading}
                  className={`w-full py-2 text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {isLoading ? 'Loading...' : 'Load newer messages'}
                </button>
              )}
              {isOtherTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-700 relative z-20 bg-gray-900/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-600`}
              >
                <FaceSmileIcon className="h-6 w-6" />
              </button>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className={`w-full ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'
                  } rounded-lg px-4 py-2`}
                />
                {showEmojiPicker && (
                  <div className="absolute bottom-full mb-2">
                    <EmojiPicker onSelect={(emoji) => {
                      setNewMessage(prev => prev + emoji);
                      inputRef.current?.focus();
                    }} />
                  </div>
                )}
              </div>
              <button
                onClick={handleSendMessage}
                className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hover:text-gray-600`}
              >
                <PaperAirplaneIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">👨‍👩‍👧‍👦</span>
            <p className={`text-xl ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select a chat to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 