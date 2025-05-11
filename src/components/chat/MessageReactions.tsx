'use client';

import { motion } from 'framer-motion';

interface Reaction {
  emoji: string;
  count: number;
}

interface MessageReactionsProps {
  reactions: Reaction[];
}

export function MessageReactions({ reactions }: MessageReactionsProps) {
  return (
    <div className="flex gap-1 mt-2">
      {reactions.map((reaction, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-1 bg-white/10 rounded-full px-2 py-0.5 text-xs"
        >
          <span>{reaction.emoji}</span>
          <span className="text-white/70">{reaction.count}</span>
        </motion.button>
      ))}
    </div>
  );
} 