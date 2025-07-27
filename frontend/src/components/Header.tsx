import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  email: string;
  onLogout: () => void;
  profileCompleted: boolean;
}

export default function Header({ email, onLogout, profileCompleted }: HeaderProps) {
  return (
    <header className="main-header">
      <h1>Find Travel Buddy</h1>
      <div className="main-user">
        <Link to="/profile" className="avatar-link">
          <div className="avatar-circle">
            {email.charAt(0).toUpperCase()}
          </div>
        </Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
