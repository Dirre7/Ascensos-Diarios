import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, Medal } from 'lucide-react';

interface NotificationProps {
  show: boolean;
  type: 'level' | 'achievement' | null;
  title: string;
  subtitle: string;
  onClose: () => void;
}

export const LevelUpNotification: React.FC<NotificationProps> = ({ show, type, title, subtitle, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.8 }}
          className="fixed top-8 left-4 right-4 z-50 pointer-events-none"
        >
          <div className={`rounded-2xl shadow-xl p-4 flex items-center gap-4 text-white ring-1 ring-white/20 ${
            type === 'level' 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
              : 'bg-gradient-to-r from-orange-400 to-pink-500'
          }`}>
            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
              {type === 'level' ? (
                <PartyPopper className="w-6 h-6 text-yellow-300" />
              ) : (
                <Medal className="w-6 h-6 text-yellow-100" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-lg leading-tight uppercase tracking-wider">{title}</h3>
              <p className="text-white/90 text-sm font-medium">{subtitle}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};