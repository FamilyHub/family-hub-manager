'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  ChartPieIcon,
  CalendarIcon,
  UserGroupIcon,
  SparklesIcon,
  BanknotesIcon,
  NewspaperIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Expenses', href: '/expenses', icon: ChartPieIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Family', href: '/family', icon: UserGroupIcon },
  { 
    name: 'Connect',
    icon: PhoneIcon,
    submenu: [
      { name: 'Chat', href: '/connect/chat', icon: ChatBubbleLeftRightIcon },
      { name: 'Video Call', href: '/connect/video', icon: VideoCameraIcon },
    ]
  },
  { name: 'AI Tools', href: '/ai-tools', icon: SparklesIcon },
  { name: 'News', href: '/news', icon: NewspaperIcon },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleSubmenu = (itemName: string) => {
    setExpandedItem(expandedItem === itemName ? null : itemName);
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '240px' }}
      className="h-screen bg-gradient-to-b from-[#1a1c2e] to-[#2d1f47] backdrop-blur-xl border-r border-white/10 flex flex-col fixed left-0 top-0 z-50"
    >
      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <motion.div
          initial={false}
          animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
          className="flex items-center"
        >
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 text-white font-semibold"
            >
              FamilyHub
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.submenu && item.submenu.some(subItem => pathname === subItem.href));
            const hasSubmenu = 'submenu' in item;

            return (
              <li key={item.name}>
                {hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-white transition-colors ${
                        isActive ? 'bg-purple-600/20' : ''
                      }`}
                    >
                      <item.icon
                        className={`h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <>
                          <motion.span className="ml-3 flex-1">{item.name}</motion.span>
                          <motion.span
                            animate={{ rotate: expandedItem === item.name ? 180 : 0 }}
                            className="ml-2"
                          >
                            ▼
                          </motion.span>
                        </>
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedItem === item.name && !isCollapsed && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="ml-4 mt-2 space-y-2"
                        >
                          {item.submenu.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <motion.li
                                key={subItem.name}
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                              >
                                <Link
                                  href={subItem.href}
                                  className={`flex items-center px-4 py-2 rounded-lg text-white/80 hover:text-white transition-colors ${
                                    isSubActive ? 'bg-purple-600' : ''
                                  }`}
                                >
                                  <subItem.icon
                                    className={`h-5 w-5 ${
                                      isSubActive ? 'text-white' : 'text-gray-400'
                                    }`}
                                  />
                                  <span className="ml-3">{subItem.name}</span>
                                </Link>
                              </motion.li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-white/80 hover:text-white transition-colors ${
                      isActive ? 'bg-purple-600' : ''
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 flex-shrink-0 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="ml-3"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <motion.button
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t border-white/10 text-white/80 hover:text-white flex items-center justify-center"
      >
        {isCollapsed ? '→' : '←'}
      </motion.button>
    </motion.div>
  );
}
