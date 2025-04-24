'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, User, LogOut, UserPlus } from 'lucide-react';
import { getUserLevel } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { removeAuthToken } from '@/utils/auth';
import AddNewMemberForm from './AddNewMemberForm';

export default function TopBar() {
  const router = useRouter();
  const [userLevel, setUserLevel] = useState<string>('USER');
  const [isLoading, setIsLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchUserLevel = async () => {
      try {
        const level = await getUserLevel();
        console.log('Fetched user level:', level);
        setUserLevel(level);
      } catch (error) {
        console.error('Error fetching user level:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserLevel();
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    router.push('/login');
  };

  // Don't render anything until after hydration
  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="fixed top-0 right-0 left-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Add New Member Button - Only for ADMIN */}
            {!isLoading && userLevel === 'ADMIN' && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddMemberForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg shadow-blue-500/20"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Member
              </motion.button>
            )}

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
                  >
                    <div className="p-4">
                      <h3 className="font-medium text-white mb-2 text-sm">Notifications</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-300">No new notifications</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
              </motion.button>

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
                  >
                    <div className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Member Form Modal */}
      <AddNewMemberForm 
        isOpen={showAddMemberForm} 
        onClose={() => setShowAddMemberForm(false)} 
      />
    </>
  );
}
