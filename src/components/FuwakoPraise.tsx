import { useEffect } from 'react';
import './FuwakoPraise.css';

interface FuwakoPraiseProps {
  show: boolean;
  message: string;
}

const FuwakoPraise = ({ show, message }: FuwakoPraiseProps) => {
  useEffect(() => {
    if (show) {
      // 体をロックして背景スクロールを防ぐ
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fuwako-praise-overlay">
      <div className="fuwako-praise-container">
        {/* 大きなシマエナガ */}
        <div className="fuwako-big">
          <div className="fuwako-big-body">
            <div className="fuwako-big-glow"></div>
            {/* 目 */}
            <div className="fuwako-big-eye left happy"></div>
            <div className="fuwako-big-eye right happy"></div>
            {/* 笑顔の口 */}
            <div className="fuwako-big-mouth happy"></div>
          </div>
        </div>

        {/* メッセージ */}
        <div className="praise-message-bubble">
          {message}
        </div>
      </div>
    </div>
  );
};

export default FuwakoPraise;
