import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/RegisterPage.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'SALESPERSON',
  });

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.text();
      alert(data); // Alert message for success or failure

      if (res.ok) {
        // Navigate to the VerifyOtp page after successful registration
        navigate('/verify-otp'); // Redirect to the Verify OTP page
      }

    } catch (err) {
      alert('Error during registration.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-title">Register</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field"
          >
            <option value="SALESPERSON">Salesperson</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button type="submit" className="login-button">Register</button>

          <div className="register-link">
            Already have an account? <Link className="link" to="/login">Login</Link>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Register;