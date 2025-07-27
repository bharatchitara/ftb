// components/Transition.tsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Transition.css';

interface TransitionState {
  message: string;
  redirectTo: string;
  delay?: number;
}

const TransitionPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as TransitionState;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(state.redirectTo);
    }, state.delay || 40000); 

    return () => clearTimeout(timer);
  }, [navigate, state]);

  return (
    <div className="transition-container">
      <div className="transition-box">
        <div className="spinner" />
        <p>{state.message}</p>
      </div>
    </div>
  );
};

export default TransitionPage;
