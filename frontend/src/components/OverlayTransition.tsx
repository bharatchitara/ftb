// components/OverlayTransition.tsx
import React, { useEffect } from 'react';
import './OverlayTransition.css';

interface OverlayTransitionProps {
  message: string;
  duration?: number;
  onComplete: () => void;
}

const OverlayTransition: React.FC<OverlayTransitionProps> = ({ message, duration = 5000, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="overlay-transition">
      <div className="overlay-box">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default OverlayTransition;
