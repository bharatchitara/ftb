import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import Map from '../components/Map';
import './Landing.css';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [otherUsersLocations, setOtherUsersLocations] = useState<
    { lat: number; lng: number; label: string }[]
  >([]);
  const navigate = useNavigate();
  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    const access = localStorage.getItem('access_token');  

    if (!access) {
      alert("You are not logged in. Redirecting to login page in 5 seconds...");
      setTimeout(() => navigate('/login'), 5000);
      return;
    }

    api.get('/auth/me/')
      .then((res) => {
        setEmail(res.data.email);

        if (userRole === 'driver' && !res.data.driver_profile_completed) {
          navigate('/profile/driver');
        } 
        else if (userRole === 'rider' && !res.data.rider_profile_completed) {
          navigate('/profile/rider');
        }

        const endpoint = userRole === 'rider' ? '/drivers/locations/' : '/riders/locations/';
        
        api.get(endpoint).then((res) => {
            const transformed = res.data
              .map((user: any) => {
                const lat = parseFloat(user.lat ?? user.latitude);
                const lng = parseFloat(user.lng ?? user.longitude);
                const label = user.label ?? user.name ?? user.email ?? `User ${user.id}`;

                if (isNaN(lat) || isNaN(lng)) return null; // Skip invalid coordinates

                return { lat, lng, label };
              })
              .filter((loc) => loc !== null); // Remove any invalid entries

            setOtherUsersLocations(transformed);
          })
          .catch((err) => console.error("Error fetching locations:", err));

      })
      .catch(() => {
        alert("Session expired or invalid token. Redirecting to login...");
        setTimeout(() => navigate('/login'), 5000);
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

    console.log(setUserLocation);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  const center = userLocation || { lat: 13.0827, lng: 80.2707 };

  return (
    <div className="main-page">
      <Header email={email} onLogout={handleLogout} />
      <main className="main-content">
        <Map
          apiKey={apiKey}
          center={center}
          userLocation={userLocation || undefined}
          otherUsersLocations={otherUsersLocations}
        />
      </main>
    </div>
  );
}
