// frontend/src/components/Hello.tsx
import { useEffect, useState } from 'react';
import { api } from '../api';

export default function Hello() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await api.get('/hello/');
        setMessage(res.data.message);
      } catch {
        setMessage('Request failed (are you logged in?)');
      }
    };
    fetchMessage();
  }, []);

  return <p>{message ?? 'Loading...'}</p>;
}
