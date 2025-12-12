import { Habit, Achievement } from './types';

export const STORAGE_KEY = 'daily_ascensions_v3'; 

// Helper for roman numerals
function romanize(num: number) {
  if (isNaN(num)) return NaN;
  var digits = String(+num).split(""),
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
           "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
           "","I","II","III","IV","V","VI","VII","VIII","IX"],
    roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop()! + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

export const TRANSLATIONS = {
  en: {
    title: "Daily Ascensions",
    subtitle: "Keep climbing, you're doing great.",
    todaysHabits: "Today's Habits",
    achievements: "Achievements",
    viewAll: "View All",
    close: "Close",
    levelUp: "Level Up!",
    achievementUnlocked: "Achievement Unlocked!",
    levelReached: "You reached Level",
    done: "DONE",
    streak: "Streak",
    days: "Days",
    history: "History",
    noHistory: "No history yet. Start completing habits!",
    habits: {
      '1': { title: 'Drink Water', unit: 'Glasses' },
      '2': { title: 'Read Books', unit: 'Pages' },
      '3': { title: 'Meditate', unit: 'Minutes' },
      '4': { title: 'Workout', unit: 'Mins' },
      '5': { title: 'Journal', unit: 'Entry' },
      '6': { title: 'Walk', unit: 'Steps' },
    },
    // Templates for dynamic generation
    achievementTemplates: {
        level: { title: "Level {0}", desc: "Reach Level {0}" },
        streak: { title: "{0}-Day Streak", desc: "Maintain a streak for {0} days" },
        earlybird: { title: "Early Bird {0}", desc: "Finish a task before 8 AM {0} times" },
        master: { title: "Zen Master {0}", desc: "Meditate for {0} total minutes" }
    }
  },
  es: {
    title: "Ascensos Diarios",
    subtitle: "Sigue subiendo, vas muy bien.",
    todaysHabits: "Hábitos de Hoy",
    achievements: "Logros",
    viewAll: "Ver Todos",
    close: "Cerrar",
    levelUp: "¡Subiste de Nivel!",
    achievementUnlocked: "¡Logro Desbloqueado!",
    levelReached: "Alcanzaste el Nivel",
    done: "LISTO",
    streak: "Racha",
    days: "Días",
    history: "Historial",
    noHistory: "Aún no hay historial. ¡Completa hábitos!",
    habits: {
      '1': { title: 'Beber Agua', unit: 'Vasos' },
      '2': { title: 'Leer Libros', unit: 'Páginas' },
      '3': { title: 'Meditar', unit: 'Minutos' },
      '4': { title: 'Entrenar', unit: 'Min' },
      '5': { title: 'Diario', unit: 'Entrada' },
      '6': { title: 'Caminar', unit: 'Pasos' },
    },
    achievementTemplates: {
        level: { title: "Nivel {0}", desc: "Alcanza el Nivel {0}" },
        streak: { title: "Racha de {0} Días", desc: "Mantén una racha de {0} días" },
        earlybird: { title: "Madrugador {0}", desc: "Termina una tarea antes de las 8 AM {0} veces" },
        master: { title: "Maestro Zen {0}", desc: "Medita por {0} minutos en total" }
    }
  }
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Drink Water',
    color: 'blue',
    current: 0,
    target: 8,
    unit: 'Glasses',
    iconName: 'water',
    incrementValue: 1,
  },
  {
    id: '2',
    title: 'Read Books',
    color: 'green',
    current: 0,
    target: 10,
    unit: 'Pages',
    iconName: 'book',
    incrementValue: 2,
  },
  {
    id: '3',
    title: 'Meditate',
    color: 'purple',
    current: 0,
    target: 10,
    unit: 'Minutes',
    iconName: 'meditate',
    incrementValue: 5,
  },
  {
    id: '4',
    title: 'Workout',
    color: 'orange',
    current: 0,
    target: 30,
    unit: 'Mins',
    iconName: 'workout',
    incrementValue: 10,
  },
  {
    id: '5',
    title: 'Journal',
    color: 'pink',
    current: 0,
    target: 1,
    unit: 'Entry',
    iconName: 'journal',
    incrementValue: 1,
  },
  {
    id: '6',
    title: 'Walk',
    color: 'cyan',
    current: 0,
    target: 5000,
    unit: 'Steps',
    iconName: 'walk',
    incrementValue: 500,
  },
];

// --- GENERATE 100 ACHIEVEMENTS ---

export const generateAchievements = (lang: 'en' | 'es' = 'en'): Achievement[] => {
  const achievements: Achievement[] = [];
  const templates = TRANSLATIONS[lang].achievementTemplates;
  
  // 1. Level Achievements
  for (let i = 1; i <= 25; i++) {
    const target = i * 4;
    achievements.push({
      id: `lvl_${target}`,
      title: templates.level.title.replace('{0}', target.toString()),
      description: templates.level.desc.replace('{0}', target.toString()),
      iconName: 'level',
      unlocked: false,
      color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400',
      category: 'level',
      targetValue: target
    });
  }

  // 2. Streak Achievements
  let streakTarget = 0;
  for (let i = 1; i <= 25; i++) {
     if (i === 1) streakTarget = 3;
     else if (i === 2) streakTarget = 7;
     else streakTarget += 5;

    achievements.push({
      id: `str_${streakTarget}`,
      title: templates.streak.title.replace('{0}', streakTarget.toString()),
      description: templates.streak.desc.replace('{0}', streakTarget.toString()),
      iconName: 'streak',
      unlocked: false,
      color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400',
      category: 'streak',
      targetValue: streakTarget
    });
  }

  // 3. Early Bird Achievements
  for (let i = 1; i <= 25; i++) {
    const target = i === 1 ? 1 : (i - 1) * 5;
    const suffix = romanize(i).toString();
    achievements.push({
      id: `early_${target}`,
      title: templates.earlybird.title.replace('{0}', suffix),
      description: templates.earlybird.desc.replace('{0}', target.toString()),
      iconName: 'earlybird',
      unlocked: false,
      color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400',
      category: 'earlybird',
      targetValue: target
    });
  }

  // 4. Zen Master
  for (let i = 1; i <= 25; i++) {
    const target = i * 50;
    const suffix = romanize(i).toString();
    achievements.push({
      id: `zen_${target}`,
      title: templates.master.title.replace('{0}', suffix),
      description: templates.master.desc.replace('{0}', target.toString()),
      iconName: 'master',
      unlocked: false,
      color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400',
      category: 'master',
      targetValue: target
    });
  }

  return achievements;
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = generateAchievements('en');

export const BASE_XP_THRESHOLD = 100;
export const XP_PER_ACTION = 15;

export const getXpForNextLevel = (level: number) => {
    return Math.floor(BASE_XP_THRESHOLD * Math.pow(1.05, level - 1));
};