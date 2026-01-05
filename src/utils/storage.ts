import type { AppData, TemplateTask, Task, Skill, SkillType } from '../types';

const STORAGE_KEY = 'kids-todo-app-data';

// 今日の日付をYYYY-MM-DD形式で取得
export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// データをローカルストレージから読み込む
export const loadData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }

  // デフォルトデータ
  return {
    templates: getDefaultTemplates(),
    dailyTasks: {},
    skills: getDefaultSkills(),
  };
};

// データをローカルストレージに保存
export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

// デフォルトのテンプレートタスク
const getDefaultTemplates = (): TemplateTask[] => {
  return [
    { id: '1', text: 'おんどく・けいさんカード', emoji: '📖' },
    { id: '2', text: 'さんすうドリル／プリント', emoji: '📝' },
    { id: '3', text: 'かんじノート／プリント', emoji: '✏️' },
    { id: '4', text: 'くもん', emoji: '📚' },
    { id: '5', text: 'じかんわり', emoji: '📅' },
    { id: '6', text: 'あしたのもちものを入れる', emoji: '🎒' },
    { id: '7', text: 'えんぴつをけずる', emoji: '✂️' },
    { id: '8', text: 'あしたのふく', emoji: '👕' },
    { id: '9', text: 'かにさんTシャツを入れる', emoji: '🦀' },
    { id: '10', text: 'ピアノのれんしゅう', emoji: '🎹' },
  ];
};

// デフォルトのスキルデータ
const getDefaultSkills = (): { [key in SkillType]: Skill } => {
  return {
    persistence: {
      id: 'persistence',
      name: 'がんばりやさん',
      emoji: '🔥',
      level: 1,
      points: 0,
      maxPoints: 10,
    },
    completion: {
      id: 'completion',
      name: 'コツコツさん',
      emoji: '🐢',
      level: 1,
      points: 0,
      maxPoints: 10,
    },
    timeManagement: {
      id: 'timeManagement',
      name: 'じかんまもる',
      emoji: '⏰',
      level: 1,
      points: 0,
      maxPoints: 10,
    },
    organization: {
      id: 'organization',
      name: 'ぜんぶできたデー',
      emoji: '🏆',
      level: 1,
      points: 0,
      maxPoints: 10,
    },
    challenge: {
      id: 'challenge',
      name: 'チャレンジャー',
      emoji: '🚀',
      level: 1,
      points: 0,
      maxPoints: 10,
    },
  };
};

// テンプレートから今日のタスクを生成
export const generateDailyTasks = (templates: TemplateTask[]): Task[] => {
  return templates.map(template => ({
    id: `${Date.now()}-${Math.random()}`,
    text: template.text,
    emoji: template.emoji,
    completed: false,
    createdAt: new Date().toISOString(),
  }));
};

// 今日のタスクを取得（なければテンプレートから生成）
export const getTodayTasks = (data: AppData): Task[] => {
  const today = getTodayString();
  if (!data.dailyTasks[today] || data.dailyTasks[today].length === 0) {
    return generateDailyTasks(data.templates);
  }
  return data.dailyTasks[today];
};

// 今日のタスクを保存
export const saveTodayTasks = (data: AppData, tasks: Task[]): AppData => {
  const today = getTodayString();
  return {
    ...data,
    dailyTasks: {
      ...data.dailyTasks,
      [today]: tasks,
    },
  };
};

// 週の開始日（日曜日）を取得
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day; // 日曜日を週の始まりとする
  return new Date(d.setDate(diff));
};

// 今週の7日間の達成状況を取得
export const getWeeklyProgress = (data: AppData): boolean[] => {
  const weekStart = getWeekStart(new Date());
  const weeklyData: boolean[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const dateString = date.toISOString().split('T')[0];

    const dayTasks = data.dailyTasks[dateString];

    // タスクが存在し、すべて完了している場合はtrue
    if (dayTasks && dayTasks.length > 0) {
      const allCompleted = dayTasks.every(task => task.completed);
      weeklyData.push(allCompleted);
    } else {
      // タスクがない場合はfalse
      weeklyData.push(false);
    }
  }

  return weeklyData;
};

// スキルにポイントを追加し、必要に応じてレベルアップ
export const addSkillPoints = (
  skill: Skill,
  points: number
): { skill: Skill; leveledUp: boolean } => {
  const newPoints = skill.points + points;
  const currentLevel = skill.level;

  // レベル5が最大
  if (currentLevel >= 5) {
    return {
      skill: { ...skill, points: skill.maxPoints },
      leveledUp: false,
    };
  }

  // レベルアップ判定
  if (newPoints >= skill.maxPoints) {
    const newLevel = Math.min(currentLevel + 1, 5);
    const nextMaxPoints = skill.maxPoints + 5; // レベルごとに必要ポイントが5増える

    return {
      skill: {
        ...skill,
        level: newLevel,
        points: newPoints - skill.maxPoints,
        maxPoints: nextMaxPoints,
      },
      leveledUp: true,
    };
  }

  return {
    skill: { ...skill, points: newPoints },
    leveledUp: false,
  };
};

// タスク完了時にスキルを更新
export const updateSkillsOnTaskComplete = (data: AppData): AppData => {
  const now = new Date();

  // 継続力: タスクを完了すると常にポイント獲得
  const persistenceResult = addSkillPoints(data.skills.persistence, 1);

  // 時間管理: 19時半までに完了するとポイント獲得
  const now_minutes = now.getHours() * 60 + now.getMinutes();
  const deadline = 19 * 60 + 30; // 19:30
  let timeManagementResult = { skill: data.skills.timeManagement, leveledUp: false };
  if (now_minutes <= deadline) {
    timeManagementResult = addSkillPoints(data.skills.timeManagement, 1);
  }

  return {
    ...data,
    skills: {
      ...data.skills,
      persistence: persistenceResult.skill,
      timeManagement: timeManagementResult.skill,
    },
  };
};

// 新規タスク追加時にチャレンジスキルを更新
export const updateChallengeSkill = (data: AppData): AppData => {
  const challengeResult = addSkillPoints(data.skills.challenge, 1);

  return {
    ...data,
    skills: {
      ...data.skills,
      challenge: challengeResult.skill,
    },
  };
};

// 全タスク完了時に「ぜんぶできたデー」スキルを更新
export const updateAllCompleteSkill = (data: AppData): AppData => {
  const organizationResult = addSkillPoints(data.skills.organization, 1);

  return {
    ...data,
    skills: {
      ...data.skills,
      organization: organizationResult.skill,
    },
  };
};

// コツコツさん: 1日1回アプリを開くとポイント獲得
const DAILY_LOGIN_KEY = 'kids-todo-daily-login';

export const updateDailyLoginSkill = (data: AppData): AppData => {
  const today = getTodayString();
  const lastLogin = localStorage.getItem(DAILY_LOGIN_KEY);

  // 今日すでにポイント獲得済みの場合はスキップ
  if (lastLogin === today) {
    return data;
  }

  // 今日の日付を記録
  localStorage.setItem(DAILY_LOGIN_KEY, today);

  // コツコツさんスキルにポイント追加
  const completionResult = addSkillPoints(data.skills.completion, 1);

  return {
    ...data,
    skills: {
      ...data.skills,
      completion: completionResult.skill,
    },
  };
};
