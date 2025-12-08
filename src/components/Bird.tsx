import { useEffect, useState } from 'react';
import './Bird.css';

export type BirdMood = 'normal' | 'cheering' | 'happy' | 'super-happy';

interface BirdProps {
  mood?: BirdMood;
  message?: string;
}

const Bird = ({ mood = 'normal', message }: BirdProps) => {
  const [isShaking, setIsShaking] = useState(false);
  const [isPuffed, setIsPuffed] = useState(false);
  const [eyesClosed, setEyesClosed] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        // メッセージは親コンポーネントでクリアされる
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBirdClick = () => {
    // 10回に1回の確率でモッフモフモード
    const shouldPuff = Math.random() < 0.1;

    setEyesClosed(true);

    if (shouldPuff) {
      // モッフモフに大きくなる
      setIsPuffed(true);
      setTimeout(() => {
        setIsPuffed(false);
        setEyesClosed(false);
      }, 1000);
    } else {
      // 震える
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setEyesClosed(false);
      }, 800);
    }
  };

  return (
    <div className="bird-container">
      <div
        className={`bird bird-${mood} ${isShaking ? 'bird-shaking' : ''} ${isPuffed ? 'bird-puffed' : ''} ${eyesClosed ? 'bird-eyes-closed' : ''}`}
        onClick={handleBirdClick}
        style={{ cursor: 'pointer' }}
      >
        {/* 鳥の体 */}
        <div className="bird-body">
          {/* 翼 */}
          <div className="bird-wing left"></div>
          <div className="bird-wing right"></div>

          {/* 目 */}
          <div className="bird-eye left"></div>
          <div className="bird-eye right"></div>

          {/* くちばし */}
          <div className="bird-beak"></div>

          {/* 足 */}
          <div className="bird-feet">
            <div className="bird-foot left"></div>
            <div className="bird-foot right"></div>
          </div>
        </div>
      </div>

      {message && (
        <div className="bird-message-bubble">
          {message}
        </div>
      )}
    </div>
  );
};

export default Bird;
