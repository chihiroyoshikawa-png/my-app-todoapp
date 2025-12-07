import { useState, useEffect } from 'react';
import Fuwako from './components/Fuwako';
import TaskList from './components/TaskList';
import AddTaskForm from './components/AddTaskForm';
import ConfirmDialog from './components/ConfirmDialog';
import TemplateManager from './components/TemplateManager';
import Celebration from './components/Celebration';
import { Task, TemplateTask, CELEBRATION_MESSAGES, TASK_COMPLETE_MESSAGES } from './types';
import { loadData, saveData, getTodayTasks, saveTodayTasks } from './utils/storage';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [templates, setTemplates] = useState<TemplateTask[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTemplateManager, setShowTemplateManager] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [fuwakoMessage, setFuwakoMessage] = useState<string | undefined>();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // 初期データ読み込み
  useEffect(() => {
    const data = loadData();
    setTemplates(data.templates);
    setTasks(getTodayTasks(data));
  }, []);

  // データ保存
  const saveCurrentData = (newTasks: Task[], newTemplates?: TemplateTask[]) => {
    const data = loadData();
    const updatedData = saveTodayTasks(data, newTasks);
    if (newTemplates) {
      updatedData.templates = newTemplates;
    }
    saveData(updatedData);
  };

  // タスク完了/未完了の切り替え
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const newCompleted = !task.completed;

        // 完了時にメッセージ表示
        if (newCompleted) {
          const message = TASK_COMPLETE_MESSAGES[Math.floor(Math.random() * TASK_COMPLETE_MESSAGES.length)];
          setFuwakoMessage(message);
        }

        return { ...task, completed: newCompleted };
      }
      return task;
    });

    setTasks(updatedTasks);
    saveCurrentData(updatedTasks);

    // 全タスク完了チェック
    const allCompleted = updatedTasks.length > 0 && updatedTasks.every((task) => task.completed);
    if (allCompleted) {
      const message = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
      setCelebrationMessage(message);
      setShowCelebration(true);
      setFuwakoMessage(message);

      // 5秒後に祝福画面を閉じる
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  };

  // タスク追加
  const handleAddTask = (text: string, emoji?: string) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      emoji,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveCurrentData(updatedTasks);
  };

  // タスク削除
  const handleDeleteTask = (taskId: string) => {
    setDeleteConfirm(taskId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      const updatedTasks = tasks.filter((task) => task.id !== deleteConfirm);
      setTasks(updatedTasks);
      saveCurrentData(updatedTasks);
      setDeleteConfirm(null);
    }
  };

  // テンプレート更新
  const handleUpdateTemplates = (newTemplates: TemplateTask[]) => {
    setTemplates(newTemplates);
    saveCurrentData(tasks, newTemplates);
  };

  // 進捗計算
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalCount = tasks.length;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  // 今日の日付を表示用にフォーマット
  const formatDate = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const weekdays = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];
    const weekday = weekdays[today.getDay()];
    return `${month}がつ ${day}にち（${weekday}ようび）`;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">きょうのタスク</h1>
        <p className="app-date">{formatDate()}</p>
      </header>

      <main className="app-main">
        <Fuwako isAllCompleted={isAllCompleted} message={fuwakoMessage} />

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
        />

        <div className="action-buttons">
          <button className="action-button add-button" onClick={() => setShowAddForm(true)}>
            ＋ タスクをついかする
          </button>
          <button
            className="action-button template-button"
            onClick={() => setShowTemplateManager(true)}
          >
            ⚙️ テンプレートをへんしゅうする
          </button>
        </div>
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
          message="このタスクをけしてもいいですか？"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <Celebration show={showCelebration} message={celebrationMessage} />
    </div>
  );
}

export default App;
