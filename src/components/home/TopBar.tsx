'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-16 bg-[#2B0B3F]/50 backdrop-blur-xl border-b border-white/10 fixed top-0 right-0 left-[240px] z-10"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-[#FF3366]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">🔍</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-white/80 hover:text-white"
            >
              🔔
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF3366] rounded-full" />
            </motion.button>
            
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-80 bg-[#2B0B3F] border border-white/10 rounded-lg shadow-xl"
              >
                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <div className="p-2 hover:bg-white/5 rounded">
                      <p className="text-white/80 text-sm">New expense added by Mom</p>
                      <p className="text-white/40 text-xs">2 minutes ago</p>
                    </div>
                    <div className="p-2 hover:bg-white/5 rounded">
                      <p className="text-white/80 text-sm">Task completed by Dad</p>
                      <p className="text-white/40 text-xs">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Profile */}
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-white/80 hover:text-white"
            >
              <span>👤</span>
              <span>John Doe</span>
            </motion.button>

            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-48 bg-[#2B0B3F] border border-white/10 rounded-lg shadow-xl"
              >
                <div className="py-1">
                  <button className="block w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5">
                    Profile Settings
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5">
                    Family Settings
                  </button>
                  <button className="block w-full px-4 py-2 text-left text-[#FF3366] hover:bg-white/5">
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
