import CustomerLoginForm from './customer/CustomerLoginForm'
import CustomerRegisterForm from './customer/CustomerRegisterForm'
import CustomerProfile from './customer/CustomerProfile'


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DriverRegisterForm from './driver/DriverRegisterForm';
import DriverLoginForm from './driver/DriverLoginForm';
import DriverDashboard from './driver/DriverDashboard';
import TrackingMap from './components/TrackingMap';
import DriverProfile from './driver/DriverProfile';
import AddVehicle from './driver/AddVehicle';
import FindOrders from './driver/FindOrders';
import OrderTracking from './driver/OrderTracking'

// This is the default content shown at /dashboard
const DashboardHome = () => (
  <div>
    <h1 className="text-3xl font-bold text-gray-800 mb-4">Driver Dashboard</h1>
    <p className="text-gray-600 mb-6">Welcome! You're successfully logged in.</p>
    <div className="border rounded p-6 bg-gray-50">
      <p className="text-gray-500 text-center">Dashboard content coming soon...</p>
    </div>
  </div>
);



import RestaurantRegister from './restaurant/RestaurantRegister'



// This is the default content shown at /dashboard


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register-driver" element={<DriverRegisterForm />} />
        <Route path="/login-driver" element={<DriverLoginForm />} />
        <Route path="/trackingMap" element={<TrackingMap />} />
        <Route path="/profile" element={<DriverProfile />} />




        {/* Route for customer */}
        <Route path="/customer-login" element={<CustomerLoginForm />} />
        <Route path="/customer-register" element={<CustomerRegisterForm />} />
        <Route path="/customer-profile" element={<CustomerProfile />} />



        <Route path="/register-restaurant" element={<RestaurantRegister />} />




        {/* Dashboard layout with nested routes */}
        <Route path="/dashboard" element={<DriverDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="addVehicle" element={<AddVehicle />} />
          <Route path="findOrders" element={<FindOrders />} />
          <Route path="tracking" element={<OrderTracking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
