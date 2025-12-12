import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryEntry, Habit } from '../types';
import { Droplets, BookOpen, Brain, Dumbbell, PenLine, Footprints, X, Calendar, CheckCircle2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  habitsDef: Habit[];
  currentHabits: Habit[]; // Added current habits to show today's progress
  title: string;
  closeText: string;
  emptyText: string;
}

const getIcon = (name: string, className: string) => {
  switch (name) {
    case 'water': return <Droplets className={className} />;
    case 'book': return <BookOpen className={className} />;
    case 'meditate': return <Brain className={className} />;
    case 'workout': return <Dumbbell className={className} />;
    case 'journal': return <PenLine className={className} />;
    case 'walk': return <Footprints className={className} />;
    default: return <CheckCircle2 className={className} />;
  }
};

const getColorClass = (color?: string) => {
  switch (color) {
    case 'blue': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400';
    case 'green': return 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400';
    case 'purple': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400';
    case 'orange': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400';
    case 'pink': return 'bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400';
    case 'cyan': return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400';
    default: return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
  }
};

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, habitsDef, currentHabits, title, closeText, emptyText }) => {
  
  // Calculate today's completed habits
  const todayCompleted = currentHabits.filter(h => h.current >= h.target);
  const showToday = todayCompleted.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-slate-900 rounded-t-[2rem] z-50 overflow-hidden shadow-2xl border-t border-slate-100 dark:border-slate-800"
          >
            <div className="h-full flex flex-col">
              <div className="p-6 pb-2 flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                        <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {history.length === 0 && !showToday ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{emptyText}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Today's Section */}
                    {showToday && (
                        <div className="p-4 rounded-2xl border-2 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-200 dark:bg-indigo-800 text-[10px] font-bold text-indigo-800 dark:text-indigo-200 rounded-bl-xl">TODAY</div>
                            <h4 className="text-sm font-bold text-indigo-400 dark:text-indigo-300 mb-3 uppercase tracking-wider">Today</h4>
                            <div className="flex flex-wrap gap-2">
                                {todayCompleted.map(habit => (
                                    <div key={habit.id} className={`p-2 rounded-lg flex items-center gap-2 ${getColorClass(habit.color)}`}>
                                        {getIcon(habit.iconName, "w-4 h-4")}
                                        <span className="text-xs font-bold">{habit.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Past History */}
                    {history.map((entry, index) => (
                      <div 
                        key={`${entry.date}-${index}`}
                        className="p-4 rounded-2xl border bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm"
                      >
                        <h4 className="text-sm font-bold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">{entry.date}</h4>
                        
                        {entry.completedHabitIds.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                            {entry.completedHabitIds.map(id => {
                                const habit = habitsDef.find(h => h.id === id);
                                if (!habit) return null;
                                return (
                                <div key={id} className={`p-2 rounded-lg flex items-center gap-2 ${getColorClass(habit.color)}`}>
                                    {getIcon(habit.iconName, "w-4 h-4")}
                                    <span className="text-xs font-bold">{habit.title}</span>
                                </div>
                                );
                            })}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic">No completed habits.</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 pt-2 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
                <button 
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl active:scale-95 transition-transform"
                >
                  {closeText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};