// タスクの型定義
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  emoji?: string;
  createdAt: string;
}

// テンプレートタスクの型定義
export interface TemplateTask {
  id: string;
  text: string;
  emoji?: string;
}

// データ保存用の型定義
export interface AppData {
  templates: TemplateTask[];
  dailyTasks: {
    [date: string]: Task[];
  };
}

// 祝福メッセージの配列（8歳のふわこの口調）
export const CELEBRATION_MESSAGES = [
  'わーい！ぜんぶできたね！すごいよ！',
  'やったー！みんなできたね！',
  'さあ、いっぱいあそぼう！',
  'かんぺき！きみってすごいね！',
  'ぜんぶできちゃった！さいこう！',
  'よくがんばったね！えらいよ！',
];

// 完了時のメッセージ配列（8歳のふわこの口調）
export const TASK_COMPLETE_MESSAGES = [
  'やったね！',
  'すごいよ！',
  'えらいね！',
  'がんばったね！',
  'できたね！',
  'いいね！',
];
