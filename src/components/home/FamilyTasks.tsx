'use client';

import { motion } from 'framer-motion';

export default function FamilyTasks() {
  // Placeholder data
  const tasks = [
    { id: 1, title: 'Grocery Shopping', assignedTo: 'Mom', status: 'pending', dueDate: '2025-03-02' },
    { id: 2, title: 'Pay Electricity Bill', assignedTo: 'Dad', status: 'completed', dueDate: '2025-03-01' },
    { id: 3, title: 'Clean Room', assignedTo: 'Kids', status: 'pending', dueDate: '2025-03-01' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Family Tasks</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-white rounded-lg transition-colors"
        >
          Add Task
        </motion.button>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={task.status === 'completed'}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 checked:bg-[#FF3366]"
                  onChange={() => {}}
                />
                <div>
                  <h3 className="text-white font-medium">{task.title}</h3>
                  <p className="text-white/60 text-sm">Assigned to: {task.assignedTo}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-xs ${
                  task.status === 'completed' 
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {task.status}
                </span>
                <p className="text-white/40 text-xs mt-1">Due: {task.dueDate}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {tasks.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 py-2 text-white/60 hover:text-white text-sm transition-colors"
        >
          View All Tasks
        </motion.button>
      )}
    </motion.div>
  );
}
