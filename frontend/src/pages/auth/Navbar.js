import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <h2 className="logo">MIS & INVOICE</h2>
      <div>
        {!user ? (
          <>
            <Link className="link" to="/register">Register</Link>
            <Link className="link" to="/forgot-password">Forgot Password?</Link>
          </>
        ) : (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;