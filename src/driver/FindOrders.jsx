import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const containerStyle = {
  width: '100%',
  height: '350px',
};

const FindOrders = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [driver, setDriver] = useState(null);
  const [driverError, setDriverError] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [vehicleError, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post('https://assigns-delivery.onrender.com/api/orders/get-nearby-orders');
      if (res.data.orders) {
        setOrders(res.data.orders);
        setMessage('');
      } else {
        setMessage(res.data.message || 'No accepted orders found.');
      }
    } catch (error) {
      setMessage('Error fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicle = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://driver-service-3k84.onrender.com/api/drivers/vehicle/my-vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (res.ok && data.length > 0) {
        setVehicle(data[0]); // Get only the first vehicle
      } else {
        setError(data.message || 'No vehicles found.');
      }
    } catch (err) {
      setError('Error fetching vehicle.');
    }
  };
  
  const fetchDriverProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://driver-service-3k84.onrender.com/api/drivers/profile/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setDriver(data);
      } else {
        setDriverError(data.message || 'Failed to load driver profile.');
      }
    } catch (err) {
      setDriverError('Error fetching driver profile.');
    }
  };

  useEffect(() => {
    fetchDriverProfile();
    fetchVehicle();
    fetchOrders();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleGetOrder = async (orderId) => {
    if (!driver) {
      setMessage('Driver profile not loaded.');
      return;
    }
    if (!vehicle) {
      setMessage('Vehicle not loaded.');
      return;
    }

    try {
      // Step 1: Save assignment to AssignOrders backend
      console.log('Assigning Order:', {
        orderId: orderId,
        driverName: driver.name,
        driverId: driver._id,
        driverLocation: {
          latitude: location.lat,
          longitude: location.lng,
        },
        vehicleNumber: vehicle.number,
        contactNumber: driver.phone,
      });
      
      await setDoc(doc(db, 'assignedOrders', orderId), {
        orderId: orderId,
        driverName: driver.name,
        driverId: driver._id,
        driverLocation: {
          latitude: location.lat,
          longitude: location.lng,
        },
        vehicleNumber: vehicle.number,
        contactNumber: driver.phone,
        assignedAt: new Date(),
      });
      
      // Step 1: Assign the driver
      await axios.patch(
        `https://ordermanagementservice.onrender.com/api/orders/${orderId}/assign-driver`,
        {
          driverId: driver._id,
          driverName: driver.name,
        }
      );

      // Step 2: Update status to 'Pending'
      await axios.patch(
        `https://ordermanagementservice.onrender.com/api/orders/${orderId}/update-status`,
        {
          status: 'Pending',
        }
      );

      const selectedOrder = orders.find((o) => o._id === orderId);
      navigate('/dashboard/tracking', {
        state: {
          order: selectedOrder,
          driverLocation: location,
          restaurantLocation: selectedOrder.resturantDistance,
          coustomerLocation: selectedOrder.userDistance,
        },
      });
    } catch (error) {
      console.error('Error assigning order to driver:', error);
      setMessage('Error assigning driver or updating order status.');
    }
  };

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : activeTab === 'nearby' 
      ? orders.filter(order => {
          // This is a placeholder for actual distance calculation
          // You would implement actual distance logic here
          return true; // For now show all as nearby
        })
      : orders.filter(order => {
          // Filter for high value orders
          // Implement your filtering logic
          return true; // For now show all as high value
        });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-lg text-orange-600 font-medium">Finding orders near you...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center">Find Orders</h2>
        
        {driver && (
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-lg p-3 mt-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-2">
                <span className="text-2xl">👤</span>
              </div>
              <div className="ml-3">
                <p className="text-white font-medium">{driver.name}</p>
                <p className="text-white text-sm opacity-80">ID: {driver._id?.substring(0, 8)}...</p>
              </div>
            </div>
            
            {vehicle && (
              <div className="bg-orange-100 bg-opacity-30 rounded-lg px-3 py-1">
                <p className="text-white font-medium">🚚 {vehicle.number}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="p-4">
        {isLoaded && location ? (
          <div className="rounded-xl overflow-hidden shadow-lg border-2 border-orange-300">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={location}
              zoom={15}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
              }}
            >
              <Marker
                position={location}
                draggable={true}
                onDragEnd={(e) => {
                  setLocation({
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  });
                }}
                icon={{
                  url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
                  scaledSize: new window.google.maps.Size(40, 40),
                }}
              />
            </GoogleMap>
            <div className="bg-white p-3 flex items-center justify-center">
              <div className="flex items-center text-orange-600">
                <span className="text-xl mr-2">📍</span>
                <span className="text-sm">Your location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
              </div>
              <button 
                className="ml-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600 flex items-center"
                onClick={() => fetchOrders()}
              >
                <span className="mr-1">🔄</span>
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 text-center shadow-md">
            <p className="text-orange-600">
              {locationError || 'Fetching your location...'}
            </p>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {(driverError || vehicleError || message) && (
        <div className="mx-4 mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-600 text-center">
          {driverError || vehicleError || message}
        </div>
      )}

      {/* Order Filtering Tabs */}
      <div className="flex px-4 mb-2">
        <button 
          className={`flex-1 py-2 text-center rounded-tl-lg rounded-bl-lg font-medium ${activeTab === 'all' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border-t border-l border-b border-gray-200'}`}
          onClick={() => setActiveTab('all')}
        >
          All Orders
        </button>
        <button 
          className={`flex-1 py-2 text-center font-medium ${activeTab === 'nearby' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border-t border-b border-gray-200'}`}
          onClick={() => setActiveTab('nearby')}
        >
          Nearby
        </button>
        <button 
          className={`flex-1 py-2 text-center rounded-tr-lg rounded-br-lg font-medium ${activeTab === 'value' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border-t border-r border-b border-gray-200'}`}
          onClick={() => setActiveTab('value')}
        >
          High Value
        </button>
      </div>

      {/* Orders List */}
      <div className="p-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-md">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600">No orders available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4 pb-20">
            {filteredOrders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-xs text-gray-500">Order ID: {order._id.substring(0, 10)}...</p>
                  </div>
                  {order.status !== 'Driver Get' && (
                    <button
                      onClick={() => handleGetOrder(order._id)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors flex items-center"
                    >
                      <span className="mr-1">🚚</span>
                      Accept Order
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-orange-600">PICKUP</p>
                    <p className="text-sm font-medium mt-1 flex items-center">
                      <span className="text-lg mr-1">🍽️</span>
                      {order.resturantLocation}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-600">DELIVERY</p>
                    <p className="text-sm font-medium mt-1 flex items-center">
                      <span className="text-lg mr-1">📍</span>
                      {order.userLocation}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <span className="mr-1">⏱️</span>
                    <span>Estimated delivery: 25-30 mins</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-1">💰</span>
                    <span>Earnings: $8-12</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed Action Button */}
      <div className="fixed bottom-4 right-4">
        <button 
          onClick={() => fetchOrders()}
          className="bg-orange-500 text-white h-14 w-14 rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <span className="text-2xl">🔄</span>
        </button>
      </div>
    </div>
  );
};

export default FindOrders;