// import React from 'react';
// import { useNavigate, Outlet } from 'react-router-dom';
// import Sidebar from '../components/DashboardSideBar';

// const DriverDashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login-driver');
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar onLogout={handleLogout} />

//       <div className="flex-1 p-10">
//         <div >
          
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DriverDashboard;

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DriverDashboardSidebar from '../components/DashboardSideBar';

const DriverDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DriverDashboardSidebar 
        onLogout={handleLogout} 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        closeSidebar={closeSidebar}
      />

      {/* Dark Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;


