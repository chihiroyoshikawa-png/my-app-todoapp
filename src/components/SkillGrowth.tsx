import React from 'react';
import type { Skill } from '../types';
import './SkillGrowth.css';

interface SkillGrowthProps {
  skills: {
    persistence: Skill;
    completion: Skill;
    timeManagement: Skill;
    organization: Skill;
    challenge: Skill;
  };
}

export const SkillGrowth: React.FC<SkillGrowthProps> = ({ skills }) => {
  // スキルの配列に変換
  const skillArray = Object.values(skills);

  return (
    <div className="skill-growth">
      <div className="skill-growth-header">
        <h2 className="skill-growth-title">
          <span className="skill-growth-icon">🌟</span>
          きみのせいちょう
        </h2>
        <p className="skill-growth-subtitle">がんばったぶんだけ、つよくなるよ！</p>
      </div>

      <div className="skill-list">
        {skillArray.map((skill) => (
          <div key={skill.id} className="skill-card">
            <div className="skill-header">
              <span className="skill-emoji">{skill.emoji}</span>
              <span className="skill-name">{skill.name}</span>
            </div>

            <div className="skill-level">
              <div className="skill-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= skill.level ? 'filled' : 'empty'}`}
                  >
                    {star <= skill.level ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
              <span className="skill-level-text">レベル {skill.level}</span>
            </div>

            <div className="skill-progress">
              <div className="skill-progress-bar">
                <div
                  className="skill-progress-fill"
                  style={{
                    width: `${(skill.points / skill.maxPoints) * 100}%`,
                  }}
                />
              </div>
              <div className="skill-progress-text">
                {skill.points} / {skill.maxPoints}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="skill-tips">
        <h3 className="tips-title">💡 スキルの育て方</h3>
        <ul className="tips-list">
          <li>
            <span className="tip-icon">🔥</span>
            <strong>がんばりやさん:</strong> 毎日 やることをこなそう
          </li>
          <li>
            <span className="tip-icon">🐢</span>
            <strong>コツコツさん:</strong> 毎日 アプリを ひらこう
          </li>
          <li>
            <span className="tip-icon">⏰</span>
            <strong>時間まもる:</strong> 早い 時間に やることをしよう
          </li>
          <li>
            <span className="tip-icon">🏆</span>
            <strong>ぜんぶできたデー:</strong> 全部できた日を ふやそう
          </li>
          <li>
            <span className="tip-icon">🚀</span>
            <strong>チャレンジャー:</strong> 新しい やることにちょうせん
          </li>
        </ul>
      </div>
    </div>
  );
};
