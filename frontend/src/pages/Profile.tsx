import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
import OverlayTransition from '../components/OverlayTransition';
import './Profile.css';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/profile/')
      .then((res) => {
        const data = res.data;
        setFormData({
          name: data.name || '',
          gender: data.gender || '',
          phone: data.phone || '',
          address: data.address || '',
          latitude: data.latitude || '',
          longitude: data.longitude || '',
        });
        setEmail(data.email || '');

        // Check if profile is completed
        if (data.name && data.gender) {
          setProfileCompleted(true);
        }
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.put('/auth/profile/', formData);
      setShowOverlay(true);

    } catch (error) {
      setError(error.response.data);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Header email={email} onLogout={handleLogout} profileCompleted={profileCompleted} />
      </div>
      <div className="profile-scrollable">
        <div className="profile-container">
          <h2>Complete Your Profile</h2>
          <form onSubmit={handleSubmit}>
            <label>Name:
              <input
                type="text"
                name="name"
                disabled={profileCompleted}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>Gender:
              <select
                name="gender"
                disabled={profileCompleted}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>

            <label>Phone:
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <small>Enter the 10 Digit Phone Number without the country code</small>
            </label>

            <label>Address:
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </label>

            <label>Latitude:
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
              />
              <small>Get the Latitude from Google Maps</small>
            </label>

            <label>Longitude:
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
              />
              <small>Get the Longitude from Google Maps</small>
            </label>

            {error && <div className="error-message">{error}</div>}

            {showOverlay && (
              <OverlayTransition
                message="Saving your profile, Redirecting to Dashboard..."
                duration={5000}
                onComplete={() => navigate('/dashboard')}
              />
            )}


            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
}
