// frontend/src/pages/Home.tsx
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <main className="home">
      <div className="card">
        <h1 className="title">Find&nbsp;Travel&nbsp;partner</h1>
        <p className="subtitle">Your True Travel Buddy</p>

        <Link to="/login" className="btn">
          Login
        </Link>
      </div>
    </main>
  );
}
