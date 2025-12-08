import { useState } from 'react';
import './TaskSuggestion.css';

interface TaskSuggestionProps {
  existingTasks: string[];
  onAddSuggestion: (text: string) => void;
}

export const TaskSuggestion = ({ existingTasks, onAddSuggestion }: TaskSuggestionProps) => {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = async () => {
    setIsLoading(true);
    setError(null);
    setSuggestion(null);

    try {
      const today = new Date();
      const response = await fetch('/api/suggest-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek: today.getDay(),
          month: today.getMonth() + 1,
          existingTasks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get suggestion');
      }

      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch {
      setError('ていあんをよみこめませんでした');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = () => {
    if (suggestion) {
      onAddSuggestion(suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="task-suggestion">
      {!suggestion && !isLoading && (
        <button
          className="suggestion-button"
          onClick={getSuggestion}
          disabled={isLoading}
        >
          <span className="suggestion-icon">💡</span>
          AIにていあんしてもらう
        </button>
      )}

      {isLoading && (
        <div className="suggestion-loading">
          <span className="loading-spinner"></span>
          かんがえちゅう...
        </div>
      )}

      {error && (
        <div className="suggestion-error">
          {error}
          <button className="retry-button" onClick={getSuggestion}>
            もういちど
          </button>
        </div>
      )}

      {suggestion && (
        <div className="suggestion-result">
          <div className="suggestion-label">AIのていあん:</div>
          <div className="suggestion-text">{suggestion}</div>
          <div className="suggestion-actions">
            <button className="add-suggestion-button" onClick={handleAddSuggestion}>
              ついかする
            </button>
            <button className="new-suggestion-button" onClick={getSuggestion}>
              べつのていあん
            </button>
            <button className="cancel-button" onClick={() => setSuggestion(null)}>
              やめる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
