import { useState, useEffect } from 'react';
import './Fuwako.css';

export type FuwakoMood = 'normal' | 'cheering' | 'happy' | 'super-happy';

interface FuwakoProps {
  mood?: FuwakoMood;
  message?: string;
}

const Fuwako = ({ mood = 'normal', message }: FuwakoProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="fuwako-container">
      <div className={`fuwako fuwako-${mood}`}>
        <div className="fuwako-body">
          <div className={`fuwako-eye left ${mood}`}></div>
          <div className={`fuwako-eye right ${mood}`}></div>
          <div className={`fuwako-mouth ${mood}`}></div>
        </div>
        <div className="fuwako-glow"></div>
      </div>
      {showMessage && message && (
        <div className="fuwako-message">
          <div className="message-bubble">{message}</div>
        </div>
      )}
    </div>
  );
};

export default Fuwako;
