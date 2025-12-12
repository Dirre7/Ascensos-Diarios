import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { Habit, UserState, Achievement, HistoryEntry } from './types';
import { INITIAL_HABITS, INITIAL_ACHIEVEMENTS, BASE_XP_THRESHOLD, XP_PER_ACTION, TRANSLATIONS, STORAGE_KEY, getXpForNextLevel, generateAchievements } from './constants';
import { HabitCard } from './components/HabitCard';
import { AchievementSection } from './components/AchievementSection';
import { AchievementModal } from './components/AchievementModal';
import { HistoryModal } from './components/HistoryModal';
import { LevelUpNotification } from './components/LevelUpNotification';
import { Sparkles, Moon, Sun, Flame, Calendar } from 'lucide-react';

type Language = 'en' | 'es';
type Theme = 'light' | 'dark';
type NotificationState = {
  show: boolean;
  type: 'level' | 'achievement' | null;
  title: string;
  subtitle: string;
};

const App: React.FC = () => {
  // --- STATE ---
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState<Language>('es'); // Default to Spanish
  const [theme, setTheme] = useState<Theme>('light');
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [userState, setUserState] = useState<UserState>({
    level: 1,
    currentXP: 0,
    xpToNextLevel: BASE_XP_THRESHOLD,
    stats: {
      totalMeditationMinutes: 0,
      lastLoginDate: new Date().toDateString(),
      currentStreak: 0,
      lastCompletionDate: null,
      earlyBirdCount: 0,
      history: []
    }
  });

  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: null,
    title: '',
    subtitle: ''
  });

  const t = TRANSLATIONS[language];

  // --- PERSISTENCE & INIT ---

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        let mergedState = { ...userState };

        if (parsed.userState) {
          mergedState = { ...parsed.userState };
          if (!mergedState.stats.lastLoginDate) mergedState.stats.lastLoginDate = new Date().toDateString();
          if (mergedState.stats.currentStreak === undefined) mergedState.stats.currentStreak = 0;
          if (mergedState.stats.earlyBirdCount === undefined) mergedState.stats.earlyBirdCount = 0;
          if (mergedState.stats.lastCompletionDate === undefined) mergedState.stats.lastCompletionDate = null;
          if (!mergedState.stats.history) mergedState.stats.history = [];
          
          mergedState.xpToNextLevel = getXpForNextLevel(mergedState.level);
        }
        
        if (parsed.achievements) {
          const savedUnlocks = new Set(parsed.achievements.filter((a: Achievement) => a.unlocked).map((a: Achievement) => a.id));
          const mergedAchievements = generateAchievements('es').map(initial => ({
            ...initial,
            unlocked: savedUnlocks.has(initial.id)
          }));
          setAchievements(mergedAchievements);
        }

        if (parsed.habits) setHabits(parsed.habits);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.language) setLanguage(parsed.language);

        // Daily Reset Check
        const today = new Date().toDateString();
        const lastLogin = mergedState.stats.lastLoginDate;

        if (lastLogin !== today) {
          // 1. Archive History from previous session state (parsed.habits)
          const previousHabits: Habit[] = parsed.habits || INITIAL_HABITS;
          const completedIds = previousHabits
            .filter((h: Habit) => h.current >= h.target)
            .map((h: Habit) => h.id);
          
          if (completedIds.length > 0) {
            const newHistoryEntry: HistoryEntry = {
                date: lastLogin,
                completedHabitIds: completedIds
            };
            // Add to history (prevent duplicates if somehow run twice, though date check prevents this)
            mergedState.stats.history = [newHistoryEntry, ...mergedState.stats.history];
          }

          // 2. Reset Habits
          setHabits(prev => prev.map(h => ({ ...h, current: 0 })));
          
          // 3. Check Streak validity
          const lastCompletion = mergedState.stats.lastCompletionDate;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          let newStreak = mergedState.stats.currentStreak || 0;
          // If we didn't finish yesterday, streak is broken.
          if (lastCompletion !== yesterdayStr) {
             newStreak = 0;
          }

          // Update State
          mergedState.stats.lastLoginDate = today;
          mergedState.stats.currentStreak = newStreak;
        }

        setUserState(mergedState);

      } catch (e) {
        console.error("Failed to load save data", e);
      }
    } else {
        // New user: ensure everything is in default language (ES)
        setAchievements(generateAchievements('es'));
    }
    setIsLoaded(true);
  }, []);

  // Save data on change
  useEffect(() => {
    if (!isLoaded) return;
    const dataToSave = {
      userState,
      achievements,
      habits,
      theme,
      language
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [userState, achievements, habits, theme, language, isLoaded]);

  // --- EFFECTS ---

  useEffect(() => {
    // 1. Update Habits text
    setHabits(prev => prev.map(h => ({
      ...h,
      title: t.habits[h.id as keyof typeof t.habits]?.title || h.title,
      unit: t.habits[h.id as keyof typeof t.habits]?.unit || h.unit,
    })));

    // 2. Update Achievements text (preserve unlocked status)
    setAchievements(prev => {
        const newLocalized = generateAchievements(language);
        // Create a map of current unlocked status
        const unlockedMap = new Set(prev.filter(a => a.unlocked).map(a => a.id));
        
        return newLocalized.map(a => ({
            ...a,
            unlocked: unlockedMap.has(a.id)
        }));
    });

  }, [language]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!isLoaded) return;
    checkAllAchievements();
  }, [
    userState.level, 
    userState.stats.totalMeditationMinutes, 
    userState.stats.currentStreak,
    userState.stats.earlyBirdCount,
    isLoaded
  ]);

  const checkAllAchievements = () => {
     let newAchievements = [...achievements];
     let hasUpdates = false;
     let lastUnlockedTitle = "";

     newAchievements = newAchievements.map(a => {
       if (a.unlocked) return a;
       
       let shouldUnlock = false;

       switch(a.category) {
         case 'level':
           if (userState.level >= a.targetValue) shouldUnlock = true;
           break;
         case 'master': // Zen Master
           if (userState.stats.totalMeditationMinutes >= a.targetValue) shouldUnlock = true;
           break;
         case 'streak':
           if (userState.stats.currentStreak >= a.targetValue) shouldUnlock = true;
           break;
         case 'earlybird':
            if (userState.stats.earlyBirdCount >= a.targetValue) shouldUnlock = true;
            break;
       }

       if (shouldUnlock) {
         hasUpdates = true;
         lastUnlockedTitle = a.title;
         return { ...a, unlocked: true };
       }
       return a;
     });

     if (hasUpdates) {
       setAchievements(newAchievements);
       showNotification('achievement', t.achievementUnlocked, lastUnlockedTitle);
       triggerConfetti();
     }
  };

  // --- HANDLERS ---

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'es' : 'en');
  };

  const showNotification = (type: 'level' | 'achievement', title: string, subtitle: string) => {
    setNotification({ show: true, type, title, subtitle });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const handleIncrement = (id: string) => {
    const now = new Date();
    const currentHour = now.getHours();
    
    let updatedHabits = [...habits];
    const habitIndex = updatedHabits.findIndex(h => h.id === id);
    if (habitIndex === -1) return;
    
    const habit = updatedHabits[habitIndex];
    if (habit.current >= habit.target) return;

    const newValue = Math.min(habit.current + habit.incrementValue, habit.target);
    const didIncrement = newValue !== habit.current;
    
    updatedHabits[habitIndex] = { ...habit, current: newValue };
    setHabits(updatedHabits); 

    if (didIncrement) {
      addXP(XP_PER_ACTION);

      // Stat Updates
      setUserState(prev => {
        const stats = { ...prev.stats };
        
        // Zen Master
        if (habit.id === '3') { 
          stats.totalMeditationMinutes += habit.incrementValue;
        }

        // Early Bird (Count increments)
        if (currentHour >= 4 && currentHour < 8) {
           stats.earlyBirdCount += 1;
        }

        return { ...prev, stats };
      });

      // Check All Habits Done & Streak
      const allDone = updatedHabits.every(h => h.current >= h.target);
      if (allDone) {
        handleAllHabitsCompleted();
      }
    }
  };

  const handleAllHabitsCompleted = () => {
    const todayStr = new Date().toDateString();
    
    setUserState(prev => {
      if (prev.stats.lastCompletionDate === todayStr) {
        return prev;
      }

      const newStreak = prev.stats.currentStreak + 1;
      
      return {
        ...prev,
        stats: {
          ...prev.stats,
          lastCompletionDate: todayStr,
          currentStreak: newStreak
        }
      };
    });
  };

  const addXP = (amount: number) => {
    setUserState(prev => {
      let newXP = prev.currentXP + amount;
      let newLevel = prev.level;
      let currentThreshold = prev.xpToNextLevel;
      let leveledUp = false;

      while (newXP >= currentThreshold && newLevel < 100) {
        newXP -= currentThreshold;
        newLevel += 1;
        currentThreshold = getXpForNextLevel(newLevel);
        leveledUp = true;
      }

      if (leveledUp) {
        setTimeout(() => {
          showNotification('level', t.levelUp, `${t.levelReached} ${newLevel}`);
          triggerConfetti();
        }, 300);
      }

      return {
        ...prev,
        currentXP: newXP,
        level: newLevel,
        xpToNextLevel: currentThreshold
      };
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#a855f7', '#3b82f6', '#22c55e']
    });
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white pb-12 font-sans selection:bg-indigo-100 transition-colors duration-300">
      <LevelUpNotification 
        show={notification.show} 
        type={notification.type}
        title={notification.title}
        subtitle={notification.subtitle}
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
      />

      <AchievementModal 
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        achievements={achievements}
        title={t.achievements}
        closeText={t.close}
      />

      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={userState.stats.history}
        habitsDef={habits}
        currentHabits={habits}
        title={t.history}
        closeText={t.close}
        emptyText={t.noHistory}
      />

      {/* Header - relative positioning to allow scroll on mobile with large header */}
      <header className="pt-8 pb-6 px-6 bg-white dark:bg-slate-900 relative z-10 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        {/* Top Row: Title & Actions */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors duration-300">{t.title}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">{t.subtitle}</p>
          </div>
          
          <div className="flex items-center gap-2">
             {/* Language Toggle */}
             <button 
               onClick={toggleLanguage}
               className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               aria-label="Toggle Language"
             >
               <span className="text-xs font-bold">{language === 'en' ? 'ES' : 'EN'}</span>
             </button>

              {/* History Button */}
             <button 
               onClick={() => setIsHistoryModalOpen(true)}
               className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               aria-label="View History"
             >
               <Calendar className="w-5 h-5" />
             </button>

             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
               aria-label="Toggle Theme"
             >
               {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </button>
          </div>
        </div>

        {/* Level Hero Section */}
        <div className="flex items-center gap-5">
            {/* Level Badge */}
            <div className="relative shrink-0 group">
                <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] blur opacity-30 dark:opacity-50 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl shadow-indigo-500/20 text-white transform group-hover:scale-105 transition-transform duration-300">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-[-2px]">Level</span>
                    <span className="text-5xl font-black tracking-tighter leading-none">{userState.level}</span>
                </div>
                {/* Sparkle Icon absolute */}
                <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 z-10">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">XP</span>
                     <div className="text-right">
                        <span className="text-lg font-black text-slate-800 dark:text-white tabular-nums">{userState.currentXP}</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 ml-1">/ {userState.xpToNextLevel}</span>
                     </div>
                 </div>
                 
                 {/* Bar */}
                 <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[3px]">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(userState.currentXP / userState.xpToNextLevel) * 100}%` }}
                        transition={{ type: "spring", stiffness: 40, damping: 15 }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full shadow-sm relative overflow-hidden"
                    >
                         <div className="absolute inset-0 bg-white/20" />
                    </motion.div>
                 </div>
                 
                 <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-400 dark:text-slate-500">
                    <span>Next Level</span>
                    <span>{userState.xpToNextLevel - userState.currentXP} XP left</span>
                 </div>
            </div>
        </div>
      </header>

      <main className="px-5 pt-8 max-w-lg mx-auto">
        {/* Streak Banner */}
        {userState.stats.currentStreak > 0 && (
          <div className="mb-8 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 rounded-2xl flex items-center justify-center gap-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-orange-900 dark:text-orange-200 font-bold text-base">
              {userState.stats.currentStreak} {t.days} {t.streak}
            </span>
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-sm uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-4 ml-1 transition-colors duration-300">{t.todaysHabits}</h2>
          {habits.map(habit => (
            <HabitCard 
              key={habit.id} 
              habit={habit} 
              onIncrement={handleIncrement} 
              doneLabel={t.done}
            />
          ))}
        </div>

        <AchievementSection 
          achievements={achievements} 
          title={t.achievements} 
          viewAllText={t.viewAll} 
          onViewAll={() => setIsAchievementModalOpen(true)}
        />
        
      </main>
    </div>
  );
};

export default App;