import { useEffect, useState } from 'react';
import './Celebration.css';

interface CelebrationProps {
  show: boolean;
  message: string;
}

const Celebration = ({ show, message }: CelebrationProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; left: number; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      // パーティクル生成
      const emojis = ['⭐', '🌸', '✨', '🎉', '🎊', '💐', '🌺', '🦋'];
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);

      // 5秒後にパーティクルをクリア
      const timer = setTimeout(() => {
        setParticles([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-content">
        <div className="celebration-emoji">🎊</div>
        <h1 className="celebration-message">{message}</h1>
        <div className="celebration-emoji">🎉</div>
      </div>
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Celebration;
