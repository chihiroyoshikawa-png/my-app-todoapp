import { useState } from 'react';
import './AddTaskForm.css';

interface AddTaskFormProps {
  onAddTask: (text: string, emoji?: string) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['📝', '🦷', '🎒', '✨', '📚', '⚽', '🎨', '🎵', '🍎', '💪'];

const AddTaskForm = ({ onAddTask, onClose }: AddTaskFormProps) => {
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>('📝');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim(), selectedEmoji);
      setText('');
      setSelectedEmoji('📝');
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">新しい やることを追加する</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="task-text" className="form-label">
              何をする？
            </label>
            <input
              id="task-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="task-input"
              placeholder="れい: 本を読む"
              autoFocus
              maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">えもじを選ぶ</label>
            <div className="emoji-grid">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-button ${selectedEmoji === emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              やめる
            </button>
            <button type="submit" className="submit-button" disabled={!text.trim()}>
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskForm;
