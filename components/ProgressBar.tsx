import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  target: number;
  colorClass: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, colorClass }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="h-3 w-full bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      />
    </div>
  );
};