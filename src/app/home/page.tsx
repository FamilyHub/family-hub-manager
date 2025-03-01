'use client';

import { motion } from 'framer-motion';
import ExpensesSummary from '@/components/home/ExpensesSummary';
import FamilyTasks from '@/components/home/FamilyTasks';
import FamilyCalendar from '@/components/home/FamilyCalendar';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl p-8 border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to FamilyHub! 👋
        </h1>
        <p className="text-white/80 max-w-3xl">
          Your central hub for managing family expenses, tasks, and events. Keep everyone connected and organized with our comprehensive family management tools.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Monthly Budget', value: '$2,500', trend: '+5%', icon: '💰' },
          { label: 'Active Tasks', value: '8', trend: '3 urgent', icon: '✓' },
          { label: 'Family Events', value: '4', trend: '2 upcoming', icon: '📅' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60">{stat.label}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                <p className="text-white/40 text-sm mt-1">{stat.trend}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ExpensesSummary />
          <FamilyTasks />
        </div>
        <FamilyCalendar />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Expense', icon: '💰', color: 'bg-[#FF3366]/20 hover:bg-[#FF3366]/30' },
          { label: 'Create Task', icon: '✓', color: 'bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30' },
          { label: 'Schedule Event', icon: '📅', color: 'bg-[#10B981]/20 hover:bg-[#10B981]/30' },
          { label: 'Family Chat', icon: '💬', color: 'bg-[#6366F1]/20 hover:bg-[#6366F1]/30' },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-xl ${action.color} text-white flex items-center justify-center gap-2`}
          >
            <span className="text-xl">{action.icon}</span>
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
