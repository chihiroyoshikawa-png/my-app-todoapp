import { useState, useEffect } from 'react';
import Bird, { type BirdMood } from './components/Bird';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import TemplateManager from './components/TemplateManager';
import Celebration from './components/Celebration';
import WeeklyProgress from './components/WeeklyProgress';
import { SkillGrowth } from './components/SkillGrowth';
import { TaskSuggestion } from './components/TaskSuggestion';
import type { Task, TemplateTask, Skill, SkillType } from './types';
import { CELEBRATION_MESSAGES, TASK_COMPLETE_MESSAGES } from './types';
import {
  loadData,
  saveData,
  getTodayTasks,
  saveTodayTasks,
  getWeeklyProgress,
  updateSkillsOnTaskComplete,
  updateChallengeSkill,
  updateAllCompleteSkill,
  updateDailyLoginSkill,
  resetSkills,
} from './utils/storage';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TemplateTask[]>([]);
  const [skills, setSkills] = useState<{ [key in SkillType]: Skill }>({} as any);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [birdMessage, setBirdMessage] = useState<string | undefined>();
  const [birdMood, setBirdMood] = useState<BirdMood>('normal');
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [weeklyData, setWeeklyData] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [currentTab, setCurrentTab] = useState<'tasks' | 'skills'>('tasks');

  // 初期データ読み込み
  useEffect(() => {
    let data = loadData();
    // コツコツさん: 1日1回アプリを開くとポイント獲得
    data = updateDailyLoginSkill(data);
    saveData(data);
    setTemplates(data.templates);
    setTasks(getTodayTasks(data));
    setWeeklyData(getWeeklyProgress(data));
    setSkills(data.skills);
  }, []);

  // データ保存
  const saveCurrentData = (newTasks: Task[], newTemplates?: TemplateTask[]) => {
    const data = loadData();
    const updatedData = saveTodayTasks(data, newTasks);
    if (newTemplates) {
      updatedData.templates = newTemplates;
    }
    saveData(updatedData);

    // 週間データを更新
    setWeeklyData(getWeeklyProgress(updatedData));
  };

  // タスク完了/未完了の切り替え
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;

        // 完了時にメッセージ表示と鳥の表情変更
        if (newCompleted) {
          const message = TASK_COMPLETE_MESSAGES[Math.floor(Math.random() * TASK_COMPLETE_MESSAGES.length)];
          setBirdMessage(message);
          setBirdMood('happy');

          // 2秒後に通常の表情に戻す
          setTimeout(() => {
            setBirdMood('normal');
          }, 2000);
        }

        return { ...task, completed: newCompleted };
      }
      return task;
    });

    setTasks(updatedTasks);

    // 全タスク完了チェック
    const allCompleted = updatedTasks.length > 0 && updatedTasks.every((task) => task.completed);

    // スキルを更新
    let data = loadData();
    data = saveTodayTasks(data, updatedTasks);
    data = updateSkillsOnTaskComplete(data);
    if (allCompleted) {
      data = updateAllCompleteSkill(data);
    }
    saveData(data);
    setSkills(data.skills);

    if (allCompleted) {
      // 金曜日かどうかをチェック
      const today = new Date();
      const isFriday = today.getDay() === 5; // 5 = 金曜日

      const message = isFriday
        ? 'やったね、あしたはお休みだ！'
        : CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];

      setCelebrationMessage(message);
      setShowCelebration(true);
      setBirdMessage(message);
      setBirdMood('super-happy');

      // 5秒後に祝福画面を閉じる
      setTimeout(() => {
        setShowCelebration(false);
        setBirdMood('normal');
      }, 5000);
    }
  };

  // タスク追加
  const handleAddTask = (text: string, emoji?: string, isChallenge?: boolean) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      emoji,
      completed: false,
      createdAt: new Date().toISOString(),
      isChallenge,
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    // チャレンジスキルを更新
    let data = loadData();
    data = saveTodayTasks(data, updatedTasks);
    data = updateChallengeSkill(data);
    saveData(data);
    setSkills(data.skills);
  };

  // 挑戦タスク追加
  const handleAddChallenge = (text: string) => {
    handleAddTask(text, undefined, true);
  };

  // 今日すでに挑戦タスクがあるか
  const hasChallengeToday = tasks.some(task => task.isChallenge);

  // タスク削除
  const handleDeleteTask = (taskId: string) => {
    setDeleteConfirm(taskId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const updatedTasks = tasks.filter((task) => task.id !== deleteConfirm);
      setTasks(updatedTasks);

      // データを保存
      let data = loadData();
      data = saveTodayTasks(data, updatedTasks);
      saveData(data);

      setDeleteConfirm(null);
    }
  };

  // テンプレート更新
  const handleUpdateTemplates = (newTemplates: TemplateTask[]) => {
    setTemplates(newTemplates);
    saveCurrentData(tasks, newTemplates);
  };

  // スキルリセット
  const handleResetSkills = () => {
    let data = loadData();
    data = resetSkills(data);
    saveData(data);
    setSkills(data.skills);
  };

  // タスク並べ替え
  const handleReorderTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveCurrentData(newTasks, templates);
  };

  // 進捗計算
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // 進捗に応じた鳥の表情（応援モード）
  useEffect(() => {
    if (totalCount > 0 && !isAllCompleted) {
      const progress = completedCount / totalCount;

      // 50%以上完了したら応援モード、それ以下なら通常モード
      if (progress >= 0.5 && birdMood !== 'happy' && birdMood !== 'super-happy') {
        setBirdMood('cheering');
      } else if (progress < 0.5 && birdMood === 'cheering') {
        setBirdMood('normal');
      }
    }
  }, [completedCount, totalCount, isAllCompleted, birdMood]);

  // 今日の日付を表示用にフォーマット
  const formatDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[today.getDay()];
    return `${month}月 ${day}日（${weekday}曜日）`;
  };

  return (
    <div className="app">
      {/* 雲 */}
      <div className="clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="cloud cloud-4"></div>
        <div className="cloud cloud-5"></div>
      </div>

      <header className="app-header">
        <h1 className="app-title">ひとりでできるかな</h1>
        <p className="app-date">{formatDate()}</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={`tab-button ${currentTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setCurrentTab('tasks')}
        >
          📋 やること
        </button>
        <button
          className={`tab-button ${currentTab === 'skills' ? 'active' : ''}`}
          onClick={() => setCurrentTab('skills')}
        >
          🌟 成長
        </button>
      </nav>

      <main className="app-main">
        {currentTab === 'tasks' ? (
          <>
            <WeeklyProgress weeklyData={weeklyData} />

            <Bird mood={birdMood} message={birdMessage} />

        {totalCount > 0 && (
          <div className="progress-bar-container">
            <div className="progress-info">
              <span className="progress-text">
                {totalCount}こ中 {completedCount}こ できたよ！
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        <TaskList
          tasks={tasks}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onReorderTasks={handleReorderTasks}
        />

            <TaskSuggestion
              existingTasks={tasks.map(t => t.text)}
              onAddChallenge={handleAddChallenge}
              hasChallengeToday={hasChallengeToday}
            />

            <div className="action-buttons">
              <button className="action-button add-button" onClick={() => setShowAddForm(true)}>
                ＋ やることを追加する
              </button>
              <button
                className="action-button template-button"
                onClick={() => setShowTemplateManager(true)}
              >
                ⚙️ テンプレートを編集する
              </button>
            </div>
          </>
        ) : (
          <SkillGrowth skills={skills} onResetSkills={handleResetSkills} />
        )}
      </main>

      {showAddForm && (
        <AddTaskForm onAddTask={handleAddTask} onClose={() => setShowAddForm(false)} />
      )}

      {showTemplateManager && (
        <TemplateManager
          templates={templates}
          onUpdateTemplates={handleUpdateTemplates}
          onClose={() => setShowTemplateManager(false)}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          message="これをけしてもいいですか？"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <Celebration show={showCelebration} message={celebrationMessage} />
    </div>
  );
}

export default App;
