import { useEffect, useState } from 'react';
import { api } from '../api';
import './RideRequestsPanel.css';

export default function RideRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('user_role');

  useEffect(() => {
    if (!userRole) {
      setLoading(false);
      return;
    }
    api.get(`/api/rides/requests/?role=${userRole}`)
      .then(res => setRequests(res.data))
      .finally(() => setLoading(false));
  }, [userRole]);

  const handleAction = (id: number, action: 'accept' | 'reject') => {
    // Implement your accept/reject API call here
    // Example:
    // api.post(`/api/rides/requests/${id}/${action}/`).then(...)
    alert(`${action === 'accept' ? 'Accepted' : 'Rejected'} request ${id}`);
  };

  if (loading) return <div>Loading ride requests...</div>;
  if (!requests.length) return <div>No ride requests found.</div>;

  const isDriver = userRole === 'driver';

  return (
    <table className="ride-requests-table" >
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>Status</th>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>{isDriver ? 'Rider Name' : 'Driver Name'}</th>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>{isDriver ? 'Rider Email' : 'Driver Email'}</th>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>{isDriver ? 'Rider Phone' : 'Driver Phone'}</th>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>Pickup Location</th>
          <th style={{ border: '1px solid #ccc', background: '#f8f8f8' }}>Created</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req: any) => (
          <tr key={req.id}>
            
            {/* Status column with buttons for drivers */}
            <td  style={{ border: '1px solid #ccc' }}>
              {isDriver ? (
                <>
                  <button
                    className="secondary-btn"
                    style={{
                      marginRight: 8,
                      background: '#e0f7fa',
                      border: '1px solid #00bcd4',
                      color: '#00796b',
                      borderRadius: 4,
                      padding: '4px 12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleAction(req.id, 'accept')}
                  >
                    Accept
                  </button>
                  <button
                    className="secondary-btn"
                    style={{
                      background: '#ffebee',
                      border: '1px solid #e57373',
                      color: '#c62828',
                      borderRadius: 4,
                      padding: '4px 12px',
                      cursor: 'pointer'
                    }}
                    onClick={() => handleAction(req.id, 'reject')}
                  >
                    Reject
                  </button>
                </>
              ) : (
                req.status
              )}
            </td>

            <td style={{ border: '1px solid #ccc' }}>{isDriver ? req.rider_name : req.driver_name}</td>
            <td style={{ border: '1px solid #ccc' }}>{isDriver ? req.rider_email : req.driver_email}</td>
            <td style={{ border: '1px solid #ccc' }}>{isDriver ? req.rider_phone : req.driver_phone}</td>
            <td style={{ border: '1px solid #ccc' }}>
              <a
                href={`https://www.google.com/maps?q=${req.pickup_lat},${req.pickup_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#1976d2', textDecoration: 'underline' }}
              >
                Pickup Location Link
              </a>
            </td>
            <td style={{ border: '1px solid #ccc' }}>{new Date(req.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
  </table>
  );
}

