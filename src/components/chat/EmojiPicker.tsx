'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const emojiCategories = [
  { name: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'] },
  { name: 'People', emojis: ['👋', '🤝', '👍', '👎', '👏', '🙌', '👋', '🤲', '👐', '🙏'] },
  { name: 'Nature', emojis: ['🌱', '🌿', '🍀', '🌴', '🌳', '🌲', '🌵', '🌺', '🌸', '🌼'] },
  { name: 'Food', emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒'] },
  { name: 'Activities', emojis: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸'] },
];

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#1a1c2e] rounded-lg shadow-xl border border-white/10 p-2 w-64"
    >
      {/* Categories */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-2">
        {emojiCategories.map((category, index) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(index)}
            className={`px-2 py-1 rounded-md text-xs whitespace-nowrap ${
              selectedCategory === index
                ? 'bg-purple-500 text-white'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Emojis Grid */}
      <div className="grid grid-cols-8 gap-1">
        {emojiCategories[selectedCategory].emojis.map((emoji) => (
          <motion.button
            key={emoji}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(emoji)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
} 