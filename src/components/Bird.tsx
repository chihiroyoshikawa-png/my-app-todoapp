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
  const [isSmiling, setIsSmiling] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        // メッセージは親コンポーネントでクリアされる
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBirdClick = () => {
    const random = Math.random();

    if (random < 1 / 13) {
      // 13回に1回: ゴロゴロ転がる
      setIsRolling(true);
      setTimeout(() => {
        setIsRolling(false);
      }, 1500);
    } else if (random < 1 / 13 + 1 / 5) {
      // 5回に1回: にっこり微笑む
      setIsSmiling(true);
      setTimeout(() => {
        setIsSmiling(false);
      }, 1200);
    } else if (random < 1 / 13 + 1 / 5 + 0.1) {
      // 10回に1回: モッフモフに大きくなる
      setEyesClosed(true);
      setIsPuffed(true);
      setTimeout(() => {
        setIsPuffed(false);
        setEyesClosed(false);
      }, 1000);
    } else {
      // その他: 震える
      setEyesClosed(true);
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
        className={`bird bird-${mood} ${isShaking ? 'bird-shaking' : ''} ${isPuffed ? 'bird-puffed' : ''} ${eyesClosed ? 'bird-eyes-closed' : ''} ${isSmiling ? 'bird-smiling' : ''} ${isRolling ? 'bird-rolling' : ''}`}
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
