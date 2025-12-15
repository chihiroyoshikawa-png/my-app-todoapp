// タスクの型定義
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  emoji?: string;
  createdAt: string;
  isChallenge?: boolean; // AIが提案した挑戦タスク
}

// テンプレートタスクの型定義
export interface TemplateTask {
  id: string;
  text: string;
  emoji?: string;
}

// スキルの型定義
export interface Skill {
  id: string;
  name: string;
  emoji: string;
  level: number; // 1-5
  points: number; // 現在のポイント
  maxPoints: number; // レベルアップに必要なポイント
}

// スキルタイプ
export type SkillType = 'persistence' | 'completion' | 'timeManagement' | 'organization' | 'challenge';

// データ保存用の型定義
export interface AppData {
  templates: TemplateTask[];
  dailyTasks: {
    [date: string]: Task[];
  };
  skills: {
    [key in SkillType]: Skill;
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
