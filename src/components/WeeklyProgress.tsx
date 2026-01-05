import './WeeklyProgress.css';

interface WeeklyProgressProps {
  weeklyData: boolean[]; // 7日分の達成状況（true=達成、false=未達成）
}

const WeeklyProgress = ({ weeklyData }: WeeklyProgressProps) => {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // 達成した日数を計算
  const completedDays = weeklyData.filter(completed => completed).length;

  return (
    <div className="weekly-progress">
      <h2 className="weekly-title">
        今週の 記ろく
      </h2>
      {completedDays > 0 && (
        <div className="weekly-stats">
          <span className="weekly-count">
            {completedDays}日 できたよ！
          </span>
        </div>
      )}
      <div className="weekly-dots">
        {weeklyData.map((completed, index) => (
          <div key={index} className="day-container">
            <div className={`day-dot ${completed ? 'completed' : 'incomplete'}`}>
              {completed && <div className="dot-glow"></div>}
            </div>
            <span className="day-label">{weekdays[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyProgress;
