'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-1 p-2"
    >
      <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
          className="w-2 h-2 bg-white/70 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
          className="w-2 h-2 bg-white/70 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.4 }}
          className="w-2 h-2 bg-white/70 rounded-full"
        />
      </div>
      <span className="text-white/50 text-sm">typing...</span>
    </motion.div>
  );
} 