import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from '../api';
import './OTPLogin.css';

export default function OTPLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const otpRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const sendOTP = async (data: any) => {
    await api.post('/auth/otp/request/', { email: data.email, role });
    setEmail(data.email);
    setStep('otp');
    setCooldown(30); 
  };

  const resendOTP = async () => {
    await api.post('/auth/otp/request/', { email });
    setCooldown(30);
    alert("OTP resent!");
  };

  const verifyOTP = async () => {
    const code = otpValues.join('');
    try {
      const res = await api.post('/auth/otp/verify/', { email, code, role });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      localStorage.setItem('user_role', role);
      navigate('/dashboard'); 
      
    } catch (error) {
      alert('Invalid or expired OTP');
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);
    if (value && index < 5) otpRefs[index + 1].current?.focus();
  };

  return (
    <div className="otp-container">
      {step === 'email' ? (
        
        <form onSubmit={handleSubmit(sendOTP)} className="otp-card">
          <h2>Email login</h2>
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Enter your email"
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

          <button type="submit" className="otp-button">Send code</button>
        </form>

      ) : (
        <div className="otp-card">
          <h2>Enter OTP</h2>
          <div className="otp-boxes">
            {otpRefs.map((ref, idx) => (
              <input
                key={idx}
                ref={ref}
                maxLength={1}
                value={otpValues[idx]}
                onChange={(e) => handleOTPChange(idx, e.target.value)}
                className="otp-digit-box"
              />
            ))}
          </div>

          <button onClick={verifyOTP} className="otp-button">Verify</button>

          <div className="otp-resend">
            {cooldown > 0 ? (
              <span>Resend available in {cooldown}s</span>
            ) : (
              <button onClick={resendOTP} className="otp-resend-btn">Resend OTP</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
