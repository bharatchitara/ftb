import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoadScript } from '@react-google-maps/api';
import Home from './pages/Home';
import OTPLogin from './pages/OTPLogin';
import MainPage from './pages/Landing'; 
import ProfilePage from './pages/Profile';
import DriverProfilePage from './pages/DriverProfile';
import TransitionPage from './components/Transition';
import MobileWarning from './components/MobileWarning';

function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function App() {

  if (isMobile()) {
    return <MobileWarning />;
  }

  const apiKey = import.meta.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<OTPLogin />} />
          <Route path="/dashboard" element={<MainPage />} /> 
          <Route path="/profile/rider" element={<ProfilePage />} />
          <Route path="/profile/driver" element={<DriverProfilePage />} />
          <Route path="/transition" element={<TransitionPage />} />
        </Routes>
      </BrowserRouter>
    </LoadScript>
  );
}