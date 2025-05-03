// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">404 - Page Not Found</h2>
        <p style={{ textAlign: 'center' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="login-button" style={{ textAlign: 'center', display: 'block', marginTop: '20px' }}>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;