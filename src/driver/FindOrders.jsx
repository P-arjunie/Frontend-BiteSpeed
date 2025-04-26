import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const FindOrders = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [driver, setDriver] = useState(null);
  const [driverError, setDriverError] = useState('');
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds',
  });

  const fetchOrders = async () => {
    try {
      const res = await axios.post('https://assigns-delivery.onrender.com/api/get-nearby-orders');
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

    fetchOrders();
  }, []);

  const handleGetOrder = async (orderId) => {
    if (!driver) {
      setMessage('Driver profile not loaded.');
      return;
    }

    try {
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

  if (loading) return <p className="text-center mt-8">Loading orders...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Find Orders Near You</h2>

      {driverError && (
        <p className="text-center text-red-500 mb-4">{driverError}</p>
      )}

      {driver && (
        <div className="text-center text-sm text-gray-700 mb-4">
          👤 <strong>Driver:</strong> {driver.name} (ID: {driver._id})
        </div>
      )}

      {location ? (
        <div className="text-gray-700 text-sm mb-2 text-center">
          📍 <strong>Your Location:</strong> Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}
        </div>
      ) : (
        <p className="text-red-500 text-center">{locationError || 'Fetching your location...'}</p>
      )}

      {isLoaded && location && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location}
            zoom={15}
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
            />
          </GoogleMap>
        </div>
      )}

      {message && <p className="text-red-500 text-center">{message}</p>}

      <div className="h-80 overflow-y-auto border rounded-2xl p-4 bg-gray-100 space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-x-4 p-5 border border-gray-200 rounded-2xl bg-white shadow-md hover:shadow-lg"
          >
            <div className="flex flex-col gap-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Restaurant:</span> {order.resturantId}
              </p>
            </div>

            <div className="flex flex-col gap-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Customer:</span> {order.customerName}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Status:</span> {order.status}
              </p>
            </div>

            {order.status !== 'Driver Get' && (
              <button
                onClick={() => handleGetOrder(order._id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700"
              >
                Get Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindOrders;
