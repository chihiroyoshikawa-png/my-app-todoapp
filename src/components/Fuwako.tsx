import { useState, useEffect } from 'react';
import './Fuwako.css';

interface FuwakoProps {
  isAllCompleted: boolean;
  message?: string;
}

const Fuwako = ({ isAllCompleted, message }: FuwakoProps) => {
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
      <div className={`fuwako ${isAllCompleted ? 'fuwako-happy' : ''}`}>
        <div className="fuwako-body">
          <div className="fuwako-eye left"></div>
          <div className="fuwako-eye right"></div>
          <div className={`fuwako-mouth ${isAllCompleted ? 'happy' : ''}`}></div>
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
