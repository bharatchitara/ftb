import { useNavigate } from 'react-router-dom';

export default function ReturnToDashboardButton({ style = {} }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', padding: '0 16px', marginTop: '4px' }}>
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        style={{
          backgroundColor: '#003366',
          color: '#ffffff',
          border: 'none',
          padding: '6px 16px 6px 10px',
          fontSize: '0.95rem',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          ...style,
        }}
      >
        <span style={{ fontSize: '1.1em', lineHeight: 1 }}>←</span>
        Return to Dashboard
      </button>
    </div>
  );
}