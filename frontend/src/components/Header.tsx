// src/components/Header.tsx
import './Header.css';

interface HeaderProps {
  email: string;
  onLogout: () => void;
}

export default function Header({ email, onLogout }: HeaderProps) {
  return (
    <header className="main-header">
      <h1>Find Travel Buddy</h1>
      <div className="main-user">
        <div className="avatar-circle">
          {email.charAt(0).toUpperCase()}
        </div>
        <button onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}
