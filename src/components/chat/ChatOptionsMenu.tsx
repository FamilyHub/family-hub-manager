'use client';

import { Fragment, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  EllipsisHorizontalIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ChatOptionsMenuProps {
  isDarkMode: boolean;
  onImageUpload: (file: File) => void;
}

export function ChatOptionsMenu({ isDarkMode, onImageUpload }: ChatOptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    setIsOpen(false);
  };

  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: -90,
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: 20,
      scale: 0.95,
      rotateX: -90,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
      >
        <EllipsisHorizontalIcon className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } ring-1 ring-black ring-opacity-5 overflow-hidden`}
          >
            <div className="py-1">
              <motion.button
                variants={itemVariants}
                onClick={handleImageClick}
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center w-full px-4 py-2 text-sm ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <PhotoIcon className="h-5 w-5 mr-3" />
                </motion.div>
                Upload Image
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
} 