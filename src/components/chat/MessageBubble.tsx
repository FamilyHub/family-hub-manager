'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageReactions } from './MessageReactions';
import { useState, useEffect } from 'react';
import { ChatMessage } from '@/services/chatService';
import { chatService } from '@/services/chatService';
import { EmojiPicker } from './EmojiPicker';

interface MessageBubbleProps {
  message: ChatMessage;
  isSender: boolean;
  isDarkMode?: boolean;
  onDelete: (messageId: string) => void;
}

export function MessageBubble({
  message,
  isSender,
  isDarkMode = false,
  onDelete,
}: MessageBubbleProps) {
  const [formattedTime, setFormattedTime] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const date = new Date(message.timestamp);
    setFormattedTime(date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toUpperCase());
  }, [message.timestamp]);

  const handleReaction = async (emoji: string) => {
    try {
      await chatService.addReaction(message.id, emoji);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDelete = async (deleteForEveryone: boolean) => {
    try {
      await chatService.deleteMessage(message.id, deleteForEveryone);
      onDelete(message.id);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'SENT':
        return '✓';
      case 'DELIVERED':
        return '✓✓';
      case 'READ':
        return '✓✓';
      default:
        return '';
    }
  };

  const bubbleVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: isSender ? 90 : -90,
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <motion.div
        className={`max-w-[70%] rounded-2xl p-4 relative ${
          isSender
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
        }`}
      >
        <motion.p 
          className="text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {message.content}
        </motion.p>

        <div className="flex items-center justify-end gap-1 mt-2">
          <span className="text-xs opacity-70">
            {formattedTime}
          </span>
          {isSender && (
            <motion.span 
              className={`text-xs ${
                message.status === 'READ' ? 'text-blue-400' : 'opacity-70'
              }`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {getStatusIcon()}
            </motion.span>
          )}
        </div>

        {message.reactions && message.reactions.length > 0 && (
          <MessageReactions reactions={message.reactions} />
        )}

        <div className="absolute right-0 top-0 mt-2 mr-2">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="text-xs opacity-50 hover:opacity-100"
          >
            ⋮
          </button>
          
          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2"
              >
                <button
                  onClick={() => setShowEmojiPicker(true)}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Add Reaction
                </button>
                <button
                  onClick={() => handleDelete(false)}
                  className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Delete for me
                </button>
                {isSender && (
                  <button
                    onClick={() => handleDelete(true)}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    Delete for everyone
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-full mb-2"
            >
              <EmojiPicker onSelect={handleReaction} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
} 