import { useState } from 'react';
import type { TemplateTask } from '../types';
import './TemplateManager.css';

interface TemplateManagerProps {
  templates: TemplateTask[];
  onUpdateTemplates: (templates: TemplateTask[]) => void;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['📝', '🦷', '🎒', '✨', '📚', '⚽', '🎨', '🎵', '🍎', '💪'];

const TemplateManager = ({ templates, onUpdateTemplates, onClose }: TemplateManagerProps) => {
  const [editingTemplates, setEditingTemplates] = useState<TemplateTask[]>([...templates]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskEmoji, setNewTaskEmoji] = useState<string>('📝');

  const handleAddTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      const newTemplate: TemplateTask = {
        id: `${Date.now()}`,
        text: newTaskText.trim(),
        emoji: newTaskEmoji,
      };
      setEditingTemplates([...editingTemplates, newTemplate]);
      setNewTaskText('');
      setNewTaskEmoji('📝');
    }
  };

  const handleDeleteTemplate = (id: string) => {
    setEditingTemplates(editingTemplates.filter(t => t.id !== id));
  };

  const handleSave = () => {
    onUpdateTemplates(editingTemplates);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content template-manager" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">まいにちのタスクをせっていする</h2>

        <div className="template-list">
          {editingTemplates.map((template) => (
            <div key={template.id} className="template-item">
              <span className="template-emoji">{template.emoji}</span>
              <span className="template-text">{template.text}</span>
              <button
                className="template-delete"
                onClick={() => handleDeleteTemplate(template.id)}
              >
                🗑️
              </button>
            </div>
          ))}
          {editingTemplates.length === 0 && (
            <p className="no-templates">まだテンプレートがないよ！したからついかしてね。</p>
          )}
        </div>

        <form onSubmit={handleAddTemplate} className="add-template-form">
          <h3 className="form-subtitle">あたらしいテンプレートをついかする</h3>
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="task-input"
            placeholder="れい: はをみがく"
            maxLength={50}
          />
          <div className="emoji-select">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className={`emoji-option ${newTaskEmoji === emoji ? 'selected' : ''}`}
                onClick={() => setNewTaskEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <button type="submit" className="add-template-button" disabled={!newTaskText.trim()}>
            テンプレートをついかする
          </button>
        </form>

        <div className="form-actions">
          <button onClick={onClose} className="cancel-button">
            もどる
          </button>
          <button onClick={handleSave} className="submit-button">
            ほぞんする
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateManager;
