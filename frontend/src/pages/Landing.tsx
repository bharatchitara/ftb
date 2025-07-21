import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './Landing.css';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'rider' | 'driver'>('rider');
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access_token');
    if (!access) {
      navigate('/login');
      return;
    }

    api.get('/auth/me/')
      .then((res) => {
        console.log(res);
        setEmail(res.data.email);
        if (!res.data.profile_completed) {
          navigate('/profile'); 
        }
        
      })
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
          <div className="avatar-circle">
            {email.charAt(0).toUpperCase()}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        {mode === 'rider' ? (
          <>
            <h2>Welcome Rider!</h2>
            <p>You are now logged in. Start exploring your travel matches soon 🎒</p>
          </>
        ) : (
          <>
            <h2>Welcome Driver!</h2>
            <p>Ready to offer rides and connect with travelers 🚗</p>
          </>
        )}
      </main>
    </div>
  );
}
