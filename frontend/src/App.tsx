import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import OTPLogin from './pages/OTPLogin';
import MainPage from './pages/Landing'; 
import ProfilePage from './pages/profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<OTPLogin />} />
        <Route path="/dashboard" element={<MainPage />} /> 
        <Route path="/profile" element={<ProfilePage />} />
      
      </Routes>
    </BrowserRouter>
  );
}
