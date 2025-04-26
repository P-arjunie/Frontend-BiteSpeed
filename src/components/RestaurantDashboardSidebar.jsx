/*import React from 'react';
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaToggleOn,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const RestaurantDashboardSidebar = ({ onLogout }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
     
      <div className="text-2xl font-bold mb-10 text-center">Restaurant Panel</div>

    
      <nav className="flex flex-col gap-6 flex-1">
        <a href="/restaurant/dashboard" className="flex items-center gap-3 hover:text-yellow-400">
          <FaTachometerAlt />
          Dashboard
        </a>
        <a href="/restaurant/menu" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUtensils />
          Menu Management
        </a>
        <a href="/restaurant/orders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaClipboardList />
          Orders
        </a>
        <a href="/restaurant/availability" className="flex items-center gap-3 hover:text-yellow-400">
          <FaToggleOn />
          Availability
        </a>
        <a href="/restaurant/profile" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUser />
          Profile
        </a>
      </nav>

      <button
          onClick={() => {
              console.log("Restaurant logout clicked"); // For debug
              onLogout();
          }}
          className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-600"
      >
          <FaSignOutAlt />
                Logout
      </button>

    </div>
  );
};

export default RestaurantDashboardSidebar;
*/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUtensils,
  FaClipboardList,
  FaToggleOn,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';

const RestaurantDashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('restaurantToken');
    navigate('/login-restaurant');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-4 shadow-lg">
      <div className="text-2xl font-bold mb-10 text-center">Restaurant Panel</div>

      <nav className="flex flex-col gap-6 flex-1">
        <a href="/restaurant/dashboard" className="flex items-center gap-3 hover:text-yellow-400">
          <FaTachometerAlt /> Dashboard
        </a>
        <a href="/restaurant/menu" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUtensils /> Menu Management
        </a>
        <a href="/restaurant/orders" className="flex items-center gap-3 hover:text-yellow-400">
          <FaClipboardList /> Orders
        </a>
        
        <a href="/restaurant/profile" className="flex items-center gap-3 hover:text-yellow-400">
          <FaUser /> Profile
        </a>
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 text-red-400 hover:text-red-600"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default RestaurantDashboardSidebar;
