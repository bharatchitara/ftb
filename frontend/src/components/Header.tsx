import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  email: string;
  onLogout: () => void;
  profileCompleted: boolean;
}

export default function Header({ email, onLogout, profileCompleted }: HeaderProps) {
  const userRole = localStorage.getItem('user_role');
  const profilePath =
    userRole === 'driver'
      ? '/profile/driver'
      : userRole === 'rider'
      ? '/profile/rider'
      : '/profile';

  return (
    <header className="main-header">
      <Link to="/dashboard" className="logo-link">
        <h1>Find Travel Buddy</h1>
      </Link>
      <div className="main-user">
        <Link to={profilePath} className="avatar-link">
          <div className="avatar-circle">
            {email.charAt(0).toUpperCase()}
          </div>
        </Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}