'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProfileAvatarProps {
  avatar: string;
  isOnline: boolean;
  size?: 'sm' | 'md' | 'lg';
  isDarkMode?: boolean;
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const borderSizeClasses = {
  sm: 'w-11 h-11',
  md: 'w-13 h-13',
  lg: 'w-17 h-17',
};

// Using DiceBear API for avatars
const getDefaultAvatar = (name: string) => {
  const encodedName = encodeURIComponent(name);
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodedName}`;
};

export function ProfileAvatar({ 
  avatar, 
  isOnline, 
  size = 'md',
  isDarkMode = false 
}: ProfileAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(avatar || getDefaultAvatar('User'));

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
      setImgSrc(getDefaultAvatar('User'));
    }
  };

  return (
    <div className="relative">
      <motion.div
        className={`${borderSizeClasses[size]} rounded-full p-[2px] ${
          isOnline 
            ? 'bg-gradient-to-r from-green-400 to-blue-500' 
            : isDarkMode 
              ? 'bg-gray-600' 
              : 'bg-gray-300'
        }`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-white`}>
          <img
            src={imgSrc}
            alt="Profile"
            width={size === 'sm' ? 40 : size === 'md' ? 48 : 64}
            height={size === 'sm' ? 40 : size === 'md' ? 48 : 64}
            className="object-cover w-full h-full"
            onError={handleError}
          />
        </div>
      </motion.div>
      {isOnline && (
        <motion.div
          className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
} 