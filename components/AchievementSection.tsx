import React from 'react';
import { Achievement } from '../types';
import { Trophy, Flame, Zap, Award, Lock } from 'lucide-react';

interface AchievementSectionProps {
  achievements: Achievement[];
  title: string;
  viewAllText: string;
  onViewAll: () => void;
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

export const AchievementSection: React.FC<AchievementSectionProps> = ({ achievements, title, viewAllText, onViewAll }) => {
  // Show only first 4 in the preview section
  const previewAchievements = achievements.slice(0, 4);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-300">{title}</h2>
        <button 
          onClick={onViewAll}
          className="text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer transition-colors duration-300"
        >
          {viewAllText}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {previewAchievements.map((achievement) => (
          <div 
            key={achievement.id}
            className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${
              achievement.unlocked 
                ? 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm opacity-100' 
                : 'bg-gray-50 dark:bg-slate-800/50 border-gray-100 dark:border-slate-700/50 opacity-60'
            }`}
          >
            <div className={`p-2 rounded-lg ${achievement.unlocked ? achievement.color : 'bg-gray-200 text-gray-400 dark:bg-slate-700 dark:text-slate-500'}`}>
              {achievement.unlocked ? (
                 getIcon(achievement.iconName, "w-5 h-5")
              ) : (
                 <Lock className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate transition-colors duration-300">{achievement.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate transition-colors duration-300">{achievement.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};