import './WeeklyProgress.css';

interface WeeklyProgressProps {
  weeklyData: boolean[]; // 7日分の達成状況（true=達成、false=未達成）
}

const WeeklyProgress = ({ weeklyData }: WeeklyProgressProps) => {
  const weekdays = ['にち', 'げつ', 'か', 'すい', 'もく', 'きん', 'ど'];

  // 達成した日数を計算
  const completedDays = weeklyData.filter(completed => completed).length;

  return (
    <div className="weekly-progress">
      <h2 className="weekly-title">
        こんしゅうの きろく
      </h2>
      {completedDays > 0 && (
        <div className="weekly-stats">
          <span className="weekly-count">
            {completedDays}にち できたよ！
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
