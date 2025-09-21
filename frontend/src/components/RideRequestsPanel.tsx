import { useEffect, useState } from 'react';
import { api } from '../api';
import './RideRequestsPanel.css';

export default function RideRequestsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<{ [id: number]: boolean }>({});
  const [actionDone, setActionDone] = useState<{ [id: number]: boolean }>({});
  const [notifyMsg, setNotifyMsg] = useState<{ [id: number]: string }>({});
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

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.post(`/api/rides/requests/${id}/${action}/`);
      setActionDone(prev => ({ ...prev, [id]: true }));
      setNotifyMsg(prev => ({
        ...prev,
        [id]: 'The rider is notified about this change.'
      }));
    } catch (err) {
      alert('Failed to update request.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  if (loading) return <div>Loading ride requests...</div>;
  if (!requests.length) return <div>No ride requests found.</div>;

  const isDriver = userRole === 'driver';

  return (
    <table className="ride-requests-table">
      <thead>
        <tr>
          <th>Status</th>
          <th>{isDriver ? 'Rider Name' : 'Driver Name'}</th>
          <th>{isDriver ? 'Rider Email' : 'Driver Email'}</th>
          <th>{isDriver ? 'Rider Phone' : 'Driver Phone'}</th>
          <th>Pickup Location</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req: any) => (
          <tr key={req.id}>
            <td>
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
                      cursor: actionDone[req.id] ? 'not-allowed' : 'pointer',
                      opacity: actionDone[req.id] ? 0.6 : 1,
                    }}
                    disabled={!!actionDone[req.id] || !!actionLoading[req.id]}
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
                      cursor: actionDone[req.id] ? 'not-allowed' : 'pointer',
                      opacity: actionDone[req.id] ? 0.6 : 1,
                    }}
                    disabled={!!actionDone[req.id] || !!actionLoading[req.id]}
                    onClick={() => handleAction(req.id, 'reject')}
                  >
                    Reject
                  </button>
                  {notifyMsg[req.id] && (
                    <div style={{ marginTop: 8, color: '#388e3c', fontSize: '0.95em' }}>
                      {notifyMsg[req.id]}
                    </div>
                  )}
                </>
              ) : (
                req.status
              )}
            </td>
            <td>{isDriver ? req.rider_name : req.driver_name}</td>
            <td>{isDriver ? req.rider_email : req.driver_email}</td>
            <td>{isDriver ? req.rider_phone : req.driver_phone}</td>
            <td>
              <a
                href={`https://www.google.com/maps?q=${req.pickup_lat},${req.pickup_lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pickup Location Link
              </a>
            </td>
            <td>{new Date(req.created_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
