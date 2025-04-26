import React, { useState } from 'react';
import { FaTachometerAlt, FaBoxOpen, FaUser, FaSignOutAlt, FaSearch, FaCar, FaBars, FaTimes } from 'react-icons/fa';

const DriverDashboardSidebar = ({ onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white w-full shadow-lg">
        <div className="text-xl font-bold">Driver Panel</div>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 z-50`}
      >
        {/* Logo / App Name */}
        <div className="text-2xl font-bold mb-10 text-center hidden md:block">Driver Panel</div>

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

      {/* Main content placeholder */}
      <div className="flex-1 p-4 hidden md:block">
        {/* your main content will go here */}
      </div>
    </div>
  );
};

export default DriverDashboardSidebar;
