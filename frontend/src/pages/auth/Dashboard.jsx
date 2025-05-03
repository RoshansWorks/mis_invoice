// src/pages/Dashboard.jsx
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../../css/DashboardPage.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-form">
          <h2 className="auth-title">Welcome to Dashboard</h2>
          <p className="dashboard-info"><strong>Role:</strong> {user?.role}</p>
          <p className="dashboard-info"><strong>Redirected to:</strong> {user?.redirect}</p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Dashboard;