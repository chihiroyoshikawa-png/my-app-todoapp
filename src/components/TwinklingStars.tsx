import { useEffect, useState } from 'react';
import './TwinklingStars.css';

interface TwinklingStar {
  id: number;
  top: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export const TwinklingStars = () => {
  const [stars, setStars] = useState<TwinklingStar[]>([]);

  useEffect(() => {
    // 30個の星をランダムに配置
    const newStars: TwinklingStar[] = [];
    for (let i = 0; i < 30; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 80, // 画面上部80%の範囲
        left: Math.random() * 100,
        size: 1 + Math.random() * 2, // 1〜3pxのサイズ
        duration: 2 + Math.random() * 3, // 2〜5秒で瞬く
        delay: Math.random() * 3, // 開始タイミングをずらす
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="twinkling-stars-container">
      {stars.map(star => (
        <div
          key={star.id}
          className="twinkling-star"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
};
