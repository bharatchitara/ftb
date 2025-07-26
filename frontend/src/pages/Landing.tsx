import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header'; // Import the reusable header
import './Landing.css';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'rider' | 'driver'>('rider');
  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('access_token');

    if (!access) {
      alert("You are not logged in. Redirecting to login page in 5 seconds...");
      setTimeout(() => {
        navigate('/login');
      }, 5000);
      return;
    }

    api.get('/auth/me/')
      .then((res) => {
        setEmail(res.data.email);
        if (!res.data.profile_completed) {
          navigate('/profile');
        }
      })
      .catch(() => {
        alert("Session expired or invalid token. Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="main-page">
      <Header email={email} onLogout={handleLogout} />

      <main className="main-content">
        {mode === 'rider' ? (
          <>
            <h2>Welcome Rider!</h2>
            <p>You are now logged in. Start exploring your travel matches soon</p>
          </>
        ) : (
          <>
            <h2>Welcome Driver!</h2>
            <p>Ready to offer rides and connect with travelers</p>
          </>
        )}
      </main>
    </div>
  );
}
