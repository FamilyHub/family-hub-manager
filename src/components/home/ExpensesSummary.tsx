'use client';

import { motion } from 'framer-motion';

export default function ExpensesSummary() {
  // Placeholder data
  const expenses = [
    { category: 'Groceries', amount: 450, color: '#FF3366' },
    { category: 'Utilities', amount: 200, color: '#3B82F6' },
    { category: 'Entertainment', amount: 150, color: '#10B981' },
  ];

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
      <h2 className="text-xl font-semibold text-white mb-4">Monthly Expenses</h2>
      
      <div className="space-y-4">
        {/* Total */}
        <div className="text-3xl font-bold text-white">
          ${totalExpenses.toLocaleString()}
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white/80">{expense.category}</span>
                <span className="text-white">${expense.amount}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(expense.amount / totalExpenses) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ backgroundColor: expense.color }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-white rounded-lg transition-colors"
          >
            Add Expense
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-2 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
          >
            View All
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
