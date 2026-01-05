import type { Task } from '../types';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, onToggleTask, onDeleteTask }: TaskListProps) => {
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
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''} ${task.isChallenge ? 'challenge' : ''}`}
        >
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
