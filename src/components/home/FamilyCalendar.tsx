'use client';

import { motion } from 'framer-motion';

export default function FamilyCalendar() {
  // Placeholder data
  const events = [
    { id: 1, title: 'Family Dinner', time: '19:00', type: 'family' },
    { id: 2, title: 'Doctor Appointment', time: '14:30', type: 'medical' },
    { id: 3, title: "Mom's Birthday", time: 'All day', type: 'birthday' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate = new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Family Calendar</h2>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 bg-[#FF3366]/20 hover:bg-[#FF3366]/30 text-white rounded-lg transition-colors"
        >
          Add Event
        </motion.button>
      </div>

      {/* Mini Calendar */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map(day => (
            <div key={day} className="text-center text-white/60 text-sm">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i - currentDate.getDay() + 1);
            const isToday = date.toDateString() === currentDate.toDateString();
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className={`text-center py-1 rounded-full text-sm cursor-pointer
                  ${isToday ? 'bg-[#FF3366] text-white' : ''}
                  ${!isToday && isCurrentMonth ? 'text-white hover:bg-white/10' : 'text-white/40'}
                `}
              >
                {date.getDate()}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Today's Events */}
      <div>
        <h3 className="text-white/80 font-medium mb-3">Today's Events</h3>
        <div className="space-y-2">
          {events.map(event => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">
                  {event.type === 'family' ? '👨‍👩‍👧‍👦' : event.type === 'medical' ? '🏥' : '🎂'}
                </span>
                <div>
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <p className="text-white/60 text-sm">{event.time}</p>
                </div>
              </div>
              <button className="text-white/40 hover:text-white">•••</button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
