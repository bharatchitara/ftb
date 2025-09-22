import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  email: string;
  onLogout: () => void;
  profileCompleted: boolean;
}

export default function Header({ email, onLogout, profileCompleted }: HeaderProps) {
  const userRole = localStorage.getItem('user_role');
  
  const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : '';
  
  const profilePath =
    userRole === 'driver'
      ? '/profile/driver'
      : userRole === 'rider'
      ? '/profile/rider'
      : '/profile';
  
  return (
    <header className="main-header">
      
      <div className="header-left">
        <Link to="/dashboard" className="logo-link">
          <h1>Find Travel Buddy</h1>
        </Link>
      </div>
      
      <nav className="header-nav">
        <ul className="header-links">
          <li>
            <Link to="/dashboard"> Home</Link>
          </li>
          <li>
            <Link to="/ride-requests">Ride Requests</Link>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        <Link to={profilePath} className="avatar-link">
           <div className="avatar-circle">
             {email.charAt(0).toUpperCase()}
           </div>
        
          {displayRole && (
            <span style={{ marginTop: 4, fontWeight: 500, color: '#a29a9aff', fontSize: '0.95em' }}>
              {displayRole}
            </span>
          )}
        </Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}