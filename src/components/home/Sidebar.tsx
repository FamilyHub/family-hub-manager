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

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring", stiffness: 300 }
  },
  hover: {
    scale: 1.02,
    rotateY: 5,
    translateZ: 20,
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    transition: { 
      type: "spring", 
      stiffness: 300,
      damping: 10
    }
  }
};

const iconVariants = {
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 10
    }
  }
};

const submenuVariants = {
  hidden: { 
    height: 0, 
    opacity: 0, 
    rotateX: -90,
    transformOrigin: "top"
  },
  visible: { 
    height: "auto", 
    opacity: 1, 
    rotateX: 0,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    height: 0, 
    opacity: 0, 
    rotateX: -90,
    transition: { 
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Navigation data
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

// Enhanced Logo component with better hover effects
const Logo = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <motion.div 
    className="p-4 border-b border-slate-700"
    whileHover={{ 
      scale: 1.02,
      transition: { type: "spring", stiffness: 300 }
    }}
  >
    <motion.div
      initial={false}
      animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
      className="flex items-center"
    >
      <motion.span 
        className="text-2xl"
        whileHover={{ 
          rotateY: 180,
          scale: 1.2,
          transition: { 
            type: "spring",
            stiffness: 200,
            damping: 10
          }
        }}
      >
        👨‍👩‍👧‍👦
      </motion.span>
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-3 text-white font-semibold"
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          FamilyHub
        </motion.span>
      )}
    </motion.div>
  </motion.div>
);

// Enhanced MenuItem component with better hover effects
const MenuItem = ({ 
  item, 
  isActive, 
  isCollapsed, 
  expandedItem, 
  toggleSubmenu 
}: { 
  item: any, 
  isActive: boolean, 
  isCollapsed: boolean, 
  expandedItem: string | null, 
  toggleSubmenu: (name: string) => void 
}) => {
  const hasSubmenu = 'submenu' in item;

  return (
    <motion.li 
      variants={itemVariants}
      whileHover="hover"
    >
      {hasSubmenu ? (
        <div>
          <motion.button
            onClick={() => toggleSubmenu(item.name)}
            className={`w-full flex items-center px-4 py-3 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/50 transition-colors ${
              isActive ? 'bg-slate-700 text-white' : ''
            }`}
            whileHover={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              transition: { duration: 0.2 }
            }}
          >
            <motion.div 
              variants={iconVariants}
              whileHover="hover"
            >
              <item.icon
                className={`h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
            </motion.div>
            {!isCollapsed && (
              <>
                <motion.span 
                  className="ml-3 flex-1"
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  {item.name}
                </motion.span>
                <motion.span
                  animate={{ rotate: expandedItem === item.name ? 180 : 0 }}
                  className="ml-2 text-slate-400"
                  whileHover={{
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                >
                  ▼
                </motion.span>
              </>
            )}
          </motion.button>
          <AnimatePresence>
            {expandedItem === item.name && !isCollapsed && (
              <motion.ul
                variants={submenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="ml-4 mt-2 space-y-2"
              >
                {item.submenu?.map((subItem: any) => (
                  <SubMenuItem 
                    key={subItem.name} 
                    subItem={subItem} 
                    isActive={false} 
                  />
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <Link
          href={item.href}
          className={`flex items-center px-4 py-3 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/50 transition-colors ${
            isActive ? 'bg-slate-700 text-white' : ''
          }`}
        >
          <motion.div 
            variants={iconVariants}
            whileHover="hover"
          >
            <item.icon
              className={`h-6 w-6 flex-shrink-0 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`}
              aria-hidden="true"
            />
          </motion.div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3"
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              {item.name}
            </motion.span>
          )}
        </Link>
      )}
    </motion.li>
  );
};

// Enhanced SubMenuItem component with better hover effects
const SubMenuItem = ({ subItem, isActive }: { subItem: any, isActive: boolean }) => (
  <motion.li
    variants={itemVariants}
    whileHover="hover"
  >
    <Link
      href={subItem.href}
      className={`flex items-center px-4 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700/50 transition-colors ${
        isActive ? 'bg-slate-700 text-white' : ''
      }`}
    >
      <motion.div 
        variants={iconVariants}
        whileHover="hover"
      >
        <subItem.icon
          className={`h-5 w-5 ${
            isActive ? 'text-white' : 'text-slate-400'
          }`}
        />
      </motion.div>
      <motion.span 
        className="ml-3"
        whileHover={{
          scale: 1.05,
          transition: { type: "spring", stiffness: 300 }
        }}
      >
        {subItem.name}
      </motion.span>
    </Link>
  </motion.li>
);

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
      animate={{ 
        width: isCollapsed ? '80px' : '240px',
        perspective: '1000px',
      }}
      className="h-screen bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 flex flex-col fixed left-0 top-0 z-50"
    >
      <Logo isCollapsed={isCollapsed} />

      <nav className="flex-1 p-4 overflow-y-auto">
        <motion.ul 
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.submenu && item.submenu.some(subItem => pathname === subItem.href));
            
            return (
              <MenuItem
                key={item.name}
                item={item}
                isActive={isActive}
                isCollapsed={isCollapsed}
                expandedItem={expandedItem}
                toggleSubmenu={toggleSubmenu}
              />
            );
          })}
        </motion.ul>
      </nav>

      <motion.button
        whileHover={{ 
          scale: 1.1,
          rotateY: 180,
          transition: { type: "spring", stiffness: 300 }
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="p-4 border-t border-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
      >
        {isCollapsed ? '→' : '←'}
      </motion.button>
    </motion.div>
  );
}
