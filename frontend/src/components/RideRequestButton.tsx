import { useState } from 'react';
import { createRideRequest } from '../api';

export default function RideRequestButton({ driverId, pickupLat, pickupLng }) {
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    try {
      await createRideRequest(driverId, pickupLat, pickupLng);
      setRequested(true);
    } catch (err) {
      alert('Failed to request ride');
    }
    setLoading(false);
  };

  return (
    <div>
      {requested ? (
        <>
          <button disabled>Requested</button>
          <div style={{ color: 'green', marginTop: 8 }}>
            The driver has been notified about your ride request.
          </div>
        </>
      ) : (
        <button onClick={handleRequest} disabled={loading}>
          {loading ? 'Requesting...' : 'Request Ride'}
        </button>
      )}
    </div>
  );
}