import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../types';
import { Trophy, Flame, Zap, Award, Lock, X } from 'lucide-react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievements: Achievement[];
  title: string;
  closeText: string;
}

const getIcon = (name: string, className: string) => {
  switch (name) {
    case 'streak': return <Flame className={className} />;
    case 'level': return <Zap className={className} />;
    case 'earlybird': return <Award className={className} />;
    case 'master': return <Trophy className={className} />;
    default: return <Award className={className} />;
  }
};

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose, achievements, title, closeText }) => {
  // Sort achievements: Unlocked first
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white dark:bg-slate-900 rounded-t-[2rem] z-50 overflow-hidden shadow-2xl border-t border-slate-100 dark:border-slate-800"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-6 pb-2 flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50">
                <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{title}</h2>
                <button 
                  onClick={onClose}
                  className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 gap-4">
                  {sortedAchievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-2xl border flex items-center gap-4 transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm opacity-100' 
                          : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-60'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${achievement.unlocked ? achievement.color : 'bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                        {achievement.unlocked ? (
                           getIcon(achievement.iconName, "w-6 h-6")
                        ) : (
                           <Lock className="w-6 h-6" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-base font-bold text-gray-800 dark:text-gray-100 truncate">{achievement.title}</h4>
                          {achievement.unlocked && <span className="text-xs font-bold text-green-500 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded-full">UNLOCKED</span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
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