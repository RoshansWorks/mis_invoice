import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/ForgotPasswordPage.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.text();
      if (response.ok) {
        setMessage(data);
        setTimeout(() => navigate('/reset-password'), 2500); // Redirect after OTP
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
      <form className="login-form" onSubmit={handleSendOtp}>
        <h2 className="login-title">Forgot Password</h2>

        <input
          type="email"
          className="input-field"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="login-button">Send OTP</button>

        {message && (
          <p style={{ textAlign: 'center', marginTop: '15px', color: message.includes('❌') ? 'crimson' : 'green' }}>
            {message}
          </p>
        )}

        <div className="register-link">
          <span>Remembered? </span>
          <Link to="/login" className="link">Back to Login</Link>
        </div>
      </form>
    </div>
    <Footer/>
    </>
  );
};

export default ForgotPassword;