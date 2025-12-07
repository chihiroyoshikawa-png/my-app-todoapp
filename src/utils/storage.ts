import { AppData, TemplateTask, Task } from '../types';

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
    { id: '1', text: 'はをみがく', emoji: '🦷' },
    { id: '2', text: 'しゅくだいをする', emoji: '📝' },
    { id: '3', text: 'べんきょうどうぐをじゅんびする', emoji: '🎒' },
    { id: '4', text: 'おてつだいをする', emoji: '✨' },
  ];
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
