import { useState } from 'react';
import './TaskSuggestion.css';

interface TaskSuggestionProps {
  existingTasks: string[];
  onAddChallenge: (text: string) => void;
  hasChallengeToday: boolean;
}

export const TaskSuggestion = ({ existingTasks, onAddChallenge, hasChallengeToday }: TaskSuggestionProps) => {
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
          day: today.getDate(),
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

  const handleAddChallenge = () => {
    if (suggestion) {
      onAddChallenge(suggestion);
      setSuggestion(null);
    }
  };

  // 今日すでに挑戦タスクがある場合は表示しない
  if (hasChallengeToday) {
    return null;
  }

  return (
    <div className="task-suggestion">
      {!suggestion && !isLoading && !error && (
        <button
          className="suggestion-button challenge-button"
          onClick={getSuggestion}
          disabled={isLoading}
        >
          <span className="suggestion-icon">🔥</span>
          きょうのちょうせんをもらう
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
        <div className="suggestion-result challenge-result">
          <div className="suggestion-label">🔥 きょうのちょうせん:</div>
          <div className="suggestion-text challenge-text">{suggestion}</div>
          <div className="suggestion-actions">
            <button className="add-suggestion-button challenge-add-button" onClick={handleAddChallenge}>
              ちょうせんする！
            </button>
            <button className="new-suggestion-button" onClick={getSuggestion}>
              べつのちょうせん
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
