import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import Map from '../components/Map';
import FilterPanel from '../components/FilterPanel';
import OverlayTransition from '../components/OverlayTransition';
import { haversineDistance } from '../utils/haversine';
import './Landing.css';

export default function MainPage() {
  const [email, setEmail] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [otherUsersLocations, setOtherUsersLocations] = useState<
    {
      lat: number;
      lng: number;
      label: string;
      name?: string;
      email?: string;
      phone?: string;
      vehicleType?: string;
      address?: string;
    }[]
  >([]);
  const [filters, setFilters] = useState<{ distance: number | 'any'; vehicle: 'car' | 'bike' | 'any' }>({
    distance: 'any',
    vehicle: 'any',
  });

  const [loading, setLoading] = useState(true);
  const [userLocationLoaded, setUserLocationLoaded] = useState(false);
  const [otherUsersLoaded, setOtherUsersLoaded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const navigate = useNavigate();
  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    const access = localStorage.getItem('access_token');

    if (!access) {
      alert('You are not logged in. Redirecting to login page in 5 seconds...');
      setTimeout(() => navigate('/login'), 5000);
      return;
    }

    api.get('/auth/me/')
      .then((res) => {
        setEmail(res.data.email);

        if (userRole === 'driver' && !res.data.driver_profile_completed) {
          navigate('/profile/driver');
        } else if (userRole === 'rider' && !res.data.rider_profile_completed) {
          navigate('/profile/rider');
        }

        const endpoint = userRole === 'rider' ? '/drivers/locations/' : '/riders/locations/';

        api.get(endpoint).then((res) => {
          const transformed = res.data
            .map((user: any) => {
              const lat = parseFloat(user.lat ?? user.latitude);
              const lng = parseFloat(user.lng ?? user.longitude);
              if (isNaN(lat) || isNaN(lng)) return null;

              return {
                lat,
                lng,
                label: user.label ?? user.name ?? user.email ?? `User ${user.id}`,
                name: user.name,
                email: user.email,
                phone: user.phone,
                vehicleType: user.vehicle_type,
                address: user.address,
              };
            })
            .filter((loc) => loc !== null);
          setOtherUsersLocations(transformed);
          setOtherUsersLoaded(true);
        }).catch((err) => {
          console.error('Error fetching locations:', err);
          setOtherUsersLoaded(true);
        });
      })
      .catch(() => {
        alert('Session expired or invalid token. Redirecting to login...');
        setTimeout(() => navigate('/login'), 5000);
      });
  }, []);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 3;
    const retryDelay = 2000; // milliseconds

    const tryGetLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUserLocationLoaded(true);
        },
        (error) => {
          console.error(`Attempt ${attempts + 1} failed:`, error);
          attempts += 1;
          if (attempts < maxAttempts) {
            setTimeout(tryGetLocation, retryDelay);
          } else {
            console.warn('Max location attempts reached. Falling back to DB location...');
            fetchLocationFromDB();
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    };

    const fetchLocationFromDB = () => {
      api.get('/auth/me/')
        .then((res) => {
          const lat = parseFloat(res.data.latitude);
          const lng = parseFloat(res.data.longitude);
          if (!isNaN(lat) && !isNaN(lng)) {
            setUserLocation({ lat, lng });
          } else {
            console.error('No valid location found in user profile.');
          }
          setUserLocationLoaded(true);
        })
        .catch((err) => {
          console.error('Failed to fetch location from DB:', err);
          setUserLocationLoaded(true);
        });
    };

    tryGetLocation();
  }, []);

  useEffect(() => {
    if (userLocationLoaded && otherUsersLoaded && mapLoaded) {
      setLoading(false);
    }
  }, [userLocationLoaded, otherUsersLoaded, mapLoaded]);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  const center = userLocation || { lat: 13.0827, lng: 80.2707 };

  const filteredLocations = otherUsersLocations.filter((loc) => {
    if (!userLocation) return true;

    const distance = haversineDistance(userLocation, { lat: loc.lat, lng: loc.lng });

    const withinDistance = filters.distance === 'any' || distance <= filters.distance;
    const matchesVehicle =
      filters.vehicle === 'any' ||
      loc.vehicleType?.toLowerCase() === filters.vehicle.toLowerCase();

    return withinDistance && matchesVehicle;
  });

  return (
    <div className="main-page">
      {loading && (
        <OverlayTransition
          message="Getting the Dashboard Ready..."
          duration={10000}
          onComplete={() => setLoading(false)}
        />
      )}
      <Header email={email} onLogout={handleLogout} />
      <main className="main-content">
        <div className="map-section">
          <Map
            apiKey={apiKey}
            center={center}
            userLocation={userLocation || undefined}
            otherUsersLocations={filteredLocations}
            onMapLoad={handleMapLoad}
            radius={filters.distance === 'any' ? null : Number(filters.distance)}
          />
        </div>
        <div className="filter-section">
          <FilterPanel
            distance={filters.distance}
            vehicle={filters.vehicle}
            onFilterChange={setFilters}
          />
        </div>
      </main>
    </div>
  );
}