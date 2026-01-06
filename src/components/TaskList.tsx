import { useState } from 'react';
import type { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks?: (tasks: Task[]) => void;
}

const TaskList = ({ tasks, onToggleTask, onDeleteTask, onReorderTasks }: TaskListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // ドラッグ中の見た目を改善
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('dragging');
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newTasks = [...tasks];
    const [draggedTask] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(dropIndex, 0, draggedTask);

    onReorderTasks?.(newTasks);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // タッチデバイス用のハンドラ
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchedIndex, setTouchedIndex] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    // 長押しでドラッグを開始
    setTouchStartY(e.touches[0].clientY);
    setTouchedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchedIndex === null || touchStartY === null) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    const itemHeight = 60; // おおよそのアイテム高さ

    if (Math.abs(diff) > itemHeight / 2) {
      const direction = diff > 0 ? 1 : -1;
      const newIndex = touchedIndex + direction;

      if (newIndex >= 0 && newIndex < tasks.length) {
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(touchedIndex, 1);
        newTasks.splice(newIndex, 0, movedTask);

        onReorderTasks?.(newTasks);
        setTouchedIndex(newIndex);
        setTouchStartY(currentY);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setTouchedIndex(null);
  };

  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>まだ やることがないよ！</p>
        <p>下のボタンで追加してね 🌟</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''} ${task.isChallenge ? 'challenge' : ''} ${dragOverIndex === index ? 'drag-over' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onTouchStart={(e) => handleTouchStart(e, index)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="drag-handle" aria-label="ドラッグして並べ替え">
            ⋮⋮
          </div>

          <button
            className="task-checkbox"
            onClick={() => onToggleTask(task.id)}
            aria-label={task.completed ? '未完了にする' : '完了にする'}
          >
            {task.completed && <span className="checkmark">✓</span>}
          </button>

          <div className="task-content" onClick={() => onToggleTask(task.id)}>
            {task.isChallenge && <span className="challenge-badge">🔥</span>}
            {task.emoji && !task.isChallenge && <span className="task-emoji">{task.emoji}</span>}
            <span className="task-text">{task.text}</span>
          </div>

          <button
            className="delete-button"
            onClick={() => onDeleteTask(task.id)}
            aria-label="消す"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
