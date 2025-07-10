// frontend/src/api.ts
import axios from 'axios';

// Base instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach access‑token (if present) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
