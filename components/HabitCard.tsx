import React from 'react';
import { Habit } from '../types';
import { ProgressBar } from './ProgressBar';
import { Droplets, BookOpen, Brain, Plus, Dumbbell, PenLine, Footprints } from 'lucide-react';
import { motion } from 'framer-motion';

interface HabitCardProps {
  habit: Habit;
  onIncrement: (id: string) => void;
  doneLabel: string;
}

const getIcon = (name: string, className: string) => {
  switch (name) {
    case 'water': return <Droplets className={className} />;
    case 'book': return <BookOpen className={className} />;
    case 'meditate': return <Brain className={className} />;
    case 'workout': return <Dumbbell className={className} />;
    case 'journal': return <PenLine className={className} />;
    case 'walk': return <Footprints className={className} />;
    default: return <Droplets className={className} />;
  }
};

const getColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return {
        bg: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/50',
        text: 'text-blue-900 dark:text-blue-100',
        subText: 'text-blue-600 dark:text-blue-300',
        bar: 'bg-blue-500',
        button: 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500',
        icon: 'text-blue-500 dark:text-blue-400',
        iconBg: 'bg-white dark:bg-blue-900/40',
      };
    case 'green':
      return {
        bg: 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800/50',
        text: 'text-green-900 dark:text-green-100',
        subText: 'text-green-600 dark:text-green-300',
        bar: 'bg-green-500',
        button: 'bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-500',
        icon: 'text-green-500 dark:text-green-400',
        iconBg: 'bg-white dark:bg-green-900/40',
      };
    case 'purple':
      return {
        bg: 'bg-purple-50 border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/50',
        text: 'text-purple-900 dark:text-purple-100',
        subText: 'text-purple-600 dark:text-purple-300',
        bar: 'bg-purple-500',
        button: 'bg-purple-500 hover:bg-purple-600 text-white dark:bg-purple-600 dark:hover:bg-purple-500',
        icon: 'text-purple-500 dark:text-purple-400',
        iconBg: 'bg-white dark:bg-purple-900/40',
      };
    case 'orange':
      return {
        bg: 'bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800/50',
        text: 'text-orange-900 dark:text-orange-100',
        subText: 'text-orange-600 dark:text-orange-300',
        bar: 'bg-orange-500',
        button: 'bg-orange-500 hover:bg-orange-600 text-white dark:bg-orange-600 dark:hover:bg-orange-500',
        icon: 'text-orange-500 dark:text-orange-400',
        iconBg: 'bg-white dark:bg-orange-900/40',
      };
    case 'pink':
      return {
        bg: 'bg-pink-50 border-pink-100 dark:bg-pink-900/20 dark:border-pink-800/50',
        text: 'text-pink-900 dark:text-pink-100',
        subText: 'text-pink-600 dark:text-pink-300',
        bar: 'bg-pink-500',
        button: 'bg-pink-500 hover:bg-pink-600 text-white dark:bg-pink-600 dark:hover:bg-pink-500',
        icon: 'text-pink-500 dark:text-pink-400',
        iconBg: 'bg-white dark:bg-pink-900/40',
      };
    case 'cyan':
      return {
        bg: 'bg-cyan-50 border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800/50',
        text: 'text-cyan-900 dark:text-cyan-100',
        subText: 'text-cyan-600 dark:text-cyan-300',
        bar: 'bg-cyan-500',
        button: 'bg-cyan-500 hover:bg-cyan-600 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500',
        icon: 'text-cyan-500 dark:text-cyan-400',
        iconBg: 'bg-white dark:bg-cyan-900/40',
      };
    default:
      return {
        bg: 'bg-gray-50 dark:bg-gray-800',
        text: 'text-gray-900 dark:text-white',
        subText: 'text-gray-600 dark:text-gray-400',
        bar: 'bg-gray-500',
        button: 'bg-gray-500 text-white',
        icon: 'text-gray-500',
        iconBg: 'bg-white dark:bg-gray-700',
      };
  }
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onIncrement, doneLabel }) => {
  const styles = getColorClasses(habit.color);

  return (
    <motion.div 
      layout
      className={`relative p-5 rounded-2xl border ${styles.bg} shadow-sm mb-4 transition-colors duration-300`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl shadow-sm ${styles.icon} ${styles.iconBg} transition-colors duration-300`}>
            {getIcon(habit.iconName, "w-6 h-6")}
          </div>
          <div>
            <h3 className={`font-bold text-lg ${styles.text} transition-colors duration-300`}>{habit.title}</h3>
            <p className={`text-sm font-medium ${styles.subText} transition-colors duration-300`}>
              {habit.current} / {habit.target} {habit.unit}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onIncrement(habit.id)}
          className={`p-2 rounded-xl shadow-md transition-all duration-300 ${styles.button} flex items-center justify-center`}
          disabled={habit.current >= habit.target}
          aria-label={`Add ${habit.incrementValue} ${habit.unit}`}
        >
          {habit.current >= habit.target ? (
             <span className="text-xs font-bold px-1">{doneLabel}</span>
          ) : (
             <span className="flex items-center gap-1 text-xs font-bold px-1">
               <Plus className="w-4 h-4" />
               {habit.incrementValue}
             </span>
          )}
        </button>
      </div>
      
      <ProgressBar 
        current={habit.current} 
        target={habit.target} 
        colorClass={styles.bar} 
      />
    </motion.div>
  );
};