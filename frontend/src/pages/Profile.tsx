import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import Header from '../components/Header';
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
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/profile/')
      .then((res) => {
        setFormData({
          name: res.data.name || '',
          gender: res.data.gender || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          latitude: res.data.latitude || '',
          longitude: res.data.longitude || '',
        });
        setEmail(res.data.email || '');
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
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update profile. Please check your inputs and try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <div className="profile-page">
      <Header email={email} onLogout={handleLogout} />

      <div className="profile-container">
        <h2>Complete Your Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            <small>Enter your full name</small>
          </label>

          <label>Gender:
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <small>Select your gender</small>
          </label>

          <label>Phone:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            <small>Enter the 10 Digit Phone Number without the country code</small>
          </label>

          <label>Address:
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            <small>Enter your current address</small>
          </label>

          <label>Latitude:
            <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} required />
            <small>Get the Latitude from Google Maps</small>
          </label>

          <label>Longitude:
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} required />
            <small>Get the Longitude from Google Maps</small>
          </label>

          {error && <div className="error-message">{error}</div>}

          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
