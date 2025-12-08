import { useEffect, useState } from 'react';
import './ShootingStars.css';

interface Star {
  id: number;
  top: number;
  left: number;
  delay: number;
  duration: number;
}

export const ShootingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const createStar = () => {
      const newStar: Star = {
        id: Date.now() + Math.random(),
        top: Math.random() * 70, // 画面上部70%の範囲（上から下まで広く）
        left: Math.random() * 50 + 50, // 50%〜100%の範囲（右側から出現）
        delay: 0,
        duration: 0.8 + Math.random() * 0.4, // 0.8〜1.2秒
      };

      setStars(prev => [...prev, newStar]);

      // アニメーション終了後に削除
      setTimeout(() => {
        setStars(prev => prev.filter(star => star.id !== newStar.id));
      }, newStar.duration * 1000 + 500);
    };

    // 3〜8秒ごとにランダムで流れ星を生成
    const scheduleNextStar = () => {
      const nextDelay = 3000 + Math.random() * 5000;
      setTimeout(() => {
        createStar();
        scheduleNextStar();
      }, nextDelay);
    };

    // 初回は2秒後に開始
    const initialTimeout = setTimeout(() => {
      createStar();
      scheduleNextStar();
    }, 2000);

    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <div className="shooting-stars-container">
      {stars.map(star => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
};
