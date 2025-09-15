import { useEffect, useState } from 'react';
import { getRideRequests, updateRideRequest } from '../api';

export default function RideRequestsPanel() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getRideRequests().then(res => setRequests(res.data));
  }, []);

  const handleAction = async (id, status) => {
    await updateRideRequest(id, { status });
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <div>
      <h3>Ride Requests</h3>
      {requests.length === 0 && <p>No requests.</p>}
      {requests.map(req => (
        <div key={req.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <div>Rider: {req.rider}</div>
          <div>Status: {req.status}</div>
          {req.status === 'pending' && (
            <>
              <button onClick={() => handleAction(req.id, 'accepted')}>Accept</button>
              <button onClick={() => handleAction(req.id, 'declined')}>Decline</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}