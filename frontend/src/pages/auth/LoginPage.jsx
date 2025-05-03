import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      alert('Login successful!');
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate(response.data.redirect);
    } catch (error) {
      alert(error.response?.data || 'Login failed!');
    }
  };

  return (
    <>
      <Navbar /> 
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2 className="auth-title">Login</h2>
          <input
            className="input-field"
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
          <input
            className="input-field"
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
          <button className="auth-button" type="submit">Login</button>
          <div className="link-text">
            Don't have an account? <a href="/register" className="link">Register</a>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;