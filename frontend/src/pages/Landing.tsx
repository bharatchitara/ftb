import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import './Landing.css';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'rider' | 'driver'>('rider');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const navigate = useNavigate();
  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;

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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = userLocation || { lat: 13.0827, lng: 80.2707 };

  return (
    <div className="main-page">
      <Header email={email} onLogout={handleLogout} />

      <main className="main-content">
        {mode === 'rider' ? (
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={12}
            >
              {userLocation && (
                <Marker position={userLocation} label="You" />
              )}
            </GoogleMap>
          </LoadScript>
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
