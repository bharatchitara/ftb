import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    address: '',
    latitude: '',
    longitude: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me/')
      .then((res) => {
        setFormData({
          name: res.data.name || '',
          gender: res.data.gender || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          latitude: res.data.latitude || '',
          longitude: res.data.longitude || '',

        });
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile/', formData);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="profile-page">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </label>
        <label>Gender:
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <label>Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>Latitude:
          <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} required />
        </label>
        <label>Longitude:
          <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} required />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
