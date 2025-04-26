import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/DashboardSideBar';

const DriverDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login-driver');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar onLogout={handleLogout} />

      <div className="flex-1 p-10">
        <div >
          
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
