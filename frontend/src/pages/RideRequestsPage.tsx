import Header from '../components/Header';
import RideRequestsPanel from '../components/RideRequestsPanel';
import OverlayTransition from '../components/OverlayTransition';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import './RideRequestPage.css'; 

export default function RideRequestsPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  useEffect(() => {
    api.get('/auth/profile/').then(res => {
      setEmail(res.data.email || '');
      setLoading(false);
    });
  }, []);

  return (
    <div className="ride-request-page" style={{ minHeight: '100vh' }}>
      {loading && (
        <OverlayTransition
          message="Fetching the ride information..."
          duration={10000}
          onComplete={() => setLoading(false)}
        />
      )}
      <div className="sticky-header">
        <Header email={email} onLogout={handleLogout} />
      </div>
      <main className="ride-req-main-content">
        <h2 style={{ marginBottom: 24 }}>Ride Requests</h2>
        <RideRequestsPanel />
      </main>
    </div>
  );
}