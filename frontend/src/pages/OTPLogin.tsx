import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../api';
import './OTPLogin.css';
import OverlayTransition from '../components/OverlayTransition';

// Add a simple spinner (or use a library spinner if you prefer)
function Spinner() {
  return (
    <span className="otp-spinner" style={{
      display: 'inline-block',
      width: '18px',
      height: '18px',
      border: '2px solid #fff',
      borderTop: '2px solid #3182ce',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginLeft: '8px',
      verticalAlign: 'middle'
    }} />
  );
}

export default function OTPLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false); // <-- for send code button

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const sendOTP = async (data: any) => {
    setSending(true);
    await api.post('/auth/otp/request/', { email: data.email, role });
    setEmail(data.email);
    setStep('otp');
    setCooldown(30);
    setSending(false);
  };

  const resendOTP = async () => {
    await api.post('/auth/otp/request/', { email });
    setOtpValues(Array(6).fill(''));
    setCooldown(30);
    alert("OTP resent!");
  };

  const verifyOTP = async () => {
    const code = otpValues.join('');
    setLoading(true);
    try {
      const res = await api.post('/auth/otp/verify/', { email, code, role });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('user_role', role);
      navigate('/dashboard');
    } catch (error) {
      alert('Invalid or expired OTP');
      setLoading(false);
    }
  };

  const handleSingleOTPChange = (value: string) => {
    const sanitized = value.replace(/\D/g, '').slice(0, 6);
    setOtpValues(sanitized.split(''));
  };

  return (
    <div className="otp-container">
      {loading && (
        <OverlayTransition
          message="Verifying OTP..."
          duration={5000}
          onComplete={() => setLoading(false)}
        />
      )}
      {step === 'email' ? (
        <form onSubmit={handleSubmit(sendOTP)} className="otp-card">
          <h2>Login</h2>
          <h4>Enter your Email to proceed</h4>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="john_doe@example.com"
            className="otp-email-input"
          />

          <div className="role-toggle-container">
            <label className="role-label">Select Role:</label>
            <span className={role === 'rider' ? 'active-label' : ''}>Rider</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={role === 'driver'}
                onChange={() => setRole(role === 'rider' ? 'driver' : 'rider')}
              />
              <span className="slider round"></span>
            </label>
            <span className={role === 'driver' ? 'active-label' : ''}>Driver</span>
          </div>

          <button type="submit" className="otp-button" disabled={sending}>
            {sending ? (
              <>
                Sending
                <Spinner />
              </>
            ) : (
              'Send code'
            )}
          </button>
        </form>
      ) : (
        <div className="otp-card">
          <h2>Verify Details</h2>
          <h4>OTP send to your Email</h4>
          <input
            type="text"
            maxLength={6}
            value={otpValues.join('')}
            onChange={(e) => handleSingleOTPChange(e.target.value)}
            className="otp-single-input"
            placeholder=""
          />

          <button onClick={verifyOTP} className="otp-button"  disabled={loading}>Verify</button>

          <div className="otp-resend">
            {cooldown > 0 ? (
              <span>Resend available in {cooldown}s</span>
            ) : (
              <button onClick={resendOTP} className="otp-resend-btn">Resend OTP</button>
            )}
          </div>
        </div>
      )}
      {/* Spinner animation keyframes */}
      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}