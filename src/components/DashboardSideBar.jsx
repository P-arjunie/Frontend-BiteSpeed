import React from 'react';
import { FaTachometerAlt, FaBoxOpen, FaUser, FaSignOutAlt, FaSearch, FaCar, FaBars, FaTimes } from 'react-icons/fa';

const DriverDashboardSidebar = ({ onLogout, isSidebarOpen, toggleSidebar, closeSidebar }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col p-6 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Logo */}
        <div className="text-2xl font-bold mb-10 text-center hidden md:block">
          Driver<span className="text-yellow-400">Panel</span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-6 flex-1 mt-12 md:mt-0">
          <a href="/dashboard" className="flex items-center gap-4 text-lg hover:text-yellow-400" onClick={closeSidebar}>
            <FaTachometerAlt size={20} />
            Dashboard
          </a>
          <a href="/orders" className="flex items-center gap-4 text-lg hover:text-yellow-400" onClick={closeSidebar}>
            <FaBoxOpen size={20} />
            My Orders
          </a>
          <a href="/dashboard/findOrders" className="flex items-center gap-4 text-lg hover:text-yellow-400" onClick={closeSidebar}>
            <FaSearch size={20} />
            Find Orders
          </a>
          <a href="/dashboard/addVehicle" className="flex items-center gap-4 text-lg hover:text-yellow-400" onClick={closeSidebar}>
            <FaCar size={20} />
            Add Vehicle
          </a>
          <a href="/dashboard/profile" className="flex items-center gap-4 text-lg hover:text-yellow-400" onClick={closeSidebar}>
            <FaUser size={20} />
            Profile
          </a>
        </nav>

        {/* Logout */}
        <button
          onClick={() => {
            closeSidebar();
            onLogout();
          }}
          className="mt-8 flex items-center gap-4 text-red-400 hover:text-red-600 text-lg"
        >
          <FaSignOutAlt size={20} />
          Logout
        </button>
      </div>

      {/* Mobile Topbar */}
      <div className="flex md:hidden items-center justify-end w-full bg-blue-700 p-4 shadow-md z-40">
        <button onClick={toggleSidebar} className="text-white">
          {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </div>
  );
};

export default DriverDashboardSidebar;
