import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/ResetPasswordPage.css';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.text();
      if (response.ok) {
        setMessage(data);
        setTimeout(() => navigate('/login'), 2500);
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
    <Navbar/>
    <div className="login-container">
      <form className="login-form" onSubmit={handleResetPassword}>
        <h2 className="login-title">Reset Password</h2>

        <input
          type="email"
          className="input-field"
          placeholder="Enter your email"
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

        <input
          type="password"
          className="input-field"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">Reset Password</button>

        {message && (
          <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('❌') ? 'crimson' : 'green' }}>
            {message}
          </p>
        )}

        <div className="register-link">
          <span>Back to </span>
          <Link to="/login" className="link">Back to Login</Link>        </div>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default ResetPassword;