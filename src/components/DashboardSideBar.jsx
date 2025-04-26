import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaUser, FaSignOutAlt, FaSearch, FaCar } from 'react-icons/fa';

const DriverDashboardSidebar = ({ onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      {/* Logo / App Name */}
      <div className="text-2xl font-bold mb-10 text-center">Driver Panel</div>

      {/* Navigation */}
      <nav className="flex flex-col gap-6 flex-1">
        <a href="/dashboard" className="flex items-center gap-3 hover:text-yellow-400">
          <FaTachometerAlt />
          Dashboard
        </a>
        <a href="/orders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaBoxOpen />
          My Orders
        </a>
        <a href="/dashboard/findOrders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaSearch />
          Find Orders
        </a>
        <a href="/dashboard/addVehicle" className="flex items-center gap-3 hover:text-yellow-400">
          <FaCar />
          Add Vehicle
        </a>
        <a href="/dashboard/profile" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUser />
          Profile
        </a>
      </nav>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-600"
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
};

export default DriverDashboardSidebar;
