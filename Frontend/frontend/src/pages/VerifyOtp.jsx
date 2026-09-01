import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    location.state?.email || ''
  );

  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Invalid OTP');
        return;
      }

      alert('Email verified successfully');

      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Verify Email</h1>

        <p>
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength="6"
            required
          />

          <button type="submit">
            Verify OTP
          </button>

        </form>

        <p>
          Didn't receive the OTP?{' '}
          <Link to="/register">Register again</Link>
        </p>

      </div>
    </div>
  );
};

export default VerifyOTP;