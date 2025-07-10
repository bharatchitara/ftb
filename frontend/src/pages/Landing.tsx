import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Landing.css';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    if (!access) {
      navigate('/login');
      return;
    }

    api.get('/auth/me/')
      .then((res) => setEmail(res.data.email))
      .catch(() => navigate('/login'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <h1>Find Travel Buddy</h1>
        <div className="main-user">
          <span>{email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <h2>Welcome!</h2>
        <p>You are now logged in. Start exploring your travel matches soon 🎒</p>
      </main>
    </div>
  );
}
