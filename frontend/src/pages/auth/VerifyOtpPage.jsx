import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/VerifyOtpPage.css';

const VerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.text();
      if (response.ok) {
        setMessage(data);
        setTimeout(() => navigate('/login'), 2500); // Redirect after 2.5s
      } else {
        setMessage(`❌ ${data}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleVerify}>
          <h2 className="login-title">Verify OTP</h2>

          <input
            type="email"
            className="input-field"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            className="input-field"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button type="submit" className="login-button">Verify</button>

          {message && (
            <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('❌') ? 'crimson' : 'green' }}>
              {message}
            </p>
          )}

          <div className="register-link">
            <span>Back to </span>
            <Link to="/login" className="link">Login</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default VerifyOtp;