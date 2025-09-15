// frontend/src/api.ts
import axios from 'axios';

// Base instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const createRideRequest = (driverId: number, pickup_lat: number, pickup_lng: number) =>
  api.post('/api/rides/requests/', { driver: driverId, pickup_lat, pickup_lng });

export const getRideRequests = () =>
  api.get('/api/rides/requests/');

export const updateRideRequest = (id: number, data: any) =>
  api.patch(`/api/rides/requests/${id}/`, data);



const publicEndpoints = ['/auth/otp/request/', '/auth/otp/verify/'];

// Attach access‑token (if present) to every request
api.interceptors.request.use((config) => {
  if (config.url && !publicEndpoints.some((endpoint) => config.url?.includes(endpoint))) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
