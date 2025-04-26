import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // You'll need to ensure this is properly configured

const CustomerOrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const googleMapsApiKey = 'AIzaSyBoJXxxWOMKdexaiud8ImxzzkaHtEIYtds'; // Your Google Maps API key

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!window.google && !document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  const fetchOrder = async () => {
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`https://ordermanagementservice.onrender.com/api/orders/${orderId}`);
      setOrder(response.data);
      setError('');
      
      // If status is "Out for Delivery", fetch driver location
      if (response.data.status === 'Out for Delivery' && response.data.driverId) {
        fetchDriverLocation(response.data.driverId, orderId);
      }
    } catch (err) {
      console.error(err);
      setError('Order not found. Please check the ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverLocation = async (driverId, orderId) => {
    try {
      // Get driver location from Firestore
      const assignedOrderRef = doc(db, 'assignedOrders', orderId);
      const assignedOrderSnap = await getDoc(assignedOrderRef);
      
      if (assignedOrderSnap.exists()) {
        const assignedOrderData = assignedOrderSnap.data();
        setDriverLocation(assignedOrderData.driverLocation);
      } else {
        console.error('No driver location found for this order');
      }
    } catch (err) {
      console.error('Error fetching driver location:', err);
    }
  };

  useEffect(() => {
    if (orderId && order) {
      const id = setInterval(() => {
        fetchOrder();
        // If status is "Out for Delivery", also refresh driver location
        if (order.status === 'Out for Delivery' && order.driverId) {
          fetchDriverLocation(order.driverId, orderId);
        }
      }, 5000); // Fetch every 5 seconds
      setIntervalId(id);
    }
    return () => clearInterval(intervalId); // Clear when component unmounts
  }, [orderId, order]);

  // Initialize map when both order and driver location are available and map is loaded
  useEffect(() => {
    if (mapLoaded && order && driverLocation && order.status === 'Out for Delivery' && order.userDistance && mapRef) {
      // Create map if not already created
      if (!map) {
        const userLocation = {
          lat: parseFloat(order.userDistance.latitude) || 0,
          lng: parseFloat(order.userDistance.longitude) || 0
        };
        
        const driverLoc = {
          lat: parseFloat(driverLocation.latitude) || 0,
          lng: parseFloat(driverLocation.longitude) || 0
        };

        // Calculate center point between user and driver locations
        const centerLat = (userLocation.lat + driverLoc.lat) / 2;
        const centerLng = (userLocation.lng + driverLoc.lng) / 2;
        
        const newMap = new window.google.maps.Map(mapRef, {
          center: { lat: centerLat, lng: centerLng },
          zoom: 13,
          styles: [
            {
              "featureType": "all",
              "elementType": "geometry",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [{ "color": "#e9e9e9" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [{ "color": "#f5f5f5" }]
            },
            {
              "featureType": "road",
              "elementType": "geometry.stroke",
              "stylers": [{ "color": "#dadada" }]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [{ "color": "#f0f0f0" }]
            },
            {
              "featureType": "transit",
              "elementType": "geometry",
              "stylers": [{ "color": "#f2f2f2" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "color": "#ffffff" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#757575" }]
            }
          ]
        });
        
        // Add user marker
        new window.google.maps.Marker({
          position: userLocation,
          map: newMap,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          }
        });
        
        // Add driver marker
        new window.google.maps.Marker({
          position: driverLoc,
          map: newMap,
          title: "Driver Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
          }
        });
        
        // Draw route between driver and user
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: newMap,
          suppressMarkers: true, // Don't show default markers
          polylineOptions: {
            strokeColor: '#FF8C00',
            strokeWeight: 5
          }
        });
        
        directionsService.route({
          origin: driverLoc,
          destination: userLocation,
          travelMode: window.google.maps.TravelMode.DRIVING
        }, (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            console.error(`Directions request failed due to ${status}`);
          }
        });
        
        setMap(newMap);
      }
    }
  }, [mapLoaded, order, driverLocation, mapRef]);

  const getStep = (status) => {
    switch (status) {
      case 'Waiting for Accepted':
        return 0;
      case 'Preparing Order':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      default:
        return 0;
    }
  };

  const statusSteps = ['Waiting for Accepted', 'Preparing Order', 'Out for Delivery', 'Delivered'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="bg-orange-600 py-6 px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">Track Your Order</h1>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
            <div className="flex-grow">
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-300 mb-2">Order ID</label>
              <input
                id="orderId"
                type="text"
                placeholder="Enter your order ID number"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="border border-gray-600 p-4 w-full rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm bg-gray-700 text-white"
              />
            </div>
            <button
              onClick={fetchOrder}
              disabled={loading}
              className="bg-orange-600 text-white text-lg py-4 px-8 rounded-lg hover:bg-orange-700 transition duration-200 shadow-md flex items-center justify-center disabled:opacity-70"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </div>

          {error && (
            <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-8 rounded-md">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {order && (
            <div className="space-y-8">
              {/* Progress Step Bar */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-6">Order Status</h2>
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="h-2 bg-gray-700 rounded-full"></div>
                  
                  {/* Progress Bar Fill */}
                  <div 
                    className="absolute top-0 left-0 h-2 bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(getStep(order.status) / 3) * 100}%` }}
                  ></div>
                  
                  {/* Step Markers */}
                  <div className="flex justify-between mt-2">
                    {statusSteps.map((step, index) => (
                      <div key={index} className="relative flex flex-col items-center mt-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                          index <= getStep(order.status) 
                            ? 'bg-orange-500 border-orange-500' 
                            : 'bg-gray-800 border-gray-600'
                        }`}>
                          {index <= getStep(order.status) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>
                        <span className={`text-xs font-medium mt-2 text-center max-w-24 ${
                          index <= getStep(order.status) ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Section - Only shown when order is Out for Delivery */}
              {order.status === 'Out for Delivery' && (
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Live Delivery Tracking</h2>
                  <div 
                    ref={setMapRef}
                    className="w-full h-64 md:h-96 rounded-lg overflow-hidden"
                  >
                    {!mapLoaded && (
                      <div className="flex items-center justify-center h-full bg-gray-800">
                        <p className="text-gray-400">Loading map...</p>
                      </div>
                    )}
                  </div>
                  
                  {driverLocation && order.userDistance && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400">Your Location</h3>
                        <p className="text-white">{order.userDistance.address}</p>
                      </div>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-400">Driver Information</h3>
                        <p className="text-white">{order.driverName || 'Driver'}</p>
                        <p className="text-white">{order.vehicleNumber || 'Vehicle'}</p>
                        <p className="text-white">{order.contactNumber || 'Contact'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Order Details */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Customer Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Name</span>
                      <span className="font-medium text-white">{order.userDistance.customerName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Phone</span>
                      <span className="font-medium text-white">{order.userDistance.phone}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Address</span>
                      <span className="font-medium text-white text-right">{order.userDistance.address}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-200 mb-4">Order Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Item</span>
                      <span className="font-medium text-white">{order.itemName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Quantity</span>
                      <span className="font-medium text-white">{order.quantity}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-400">Price</span>
                      <span className="font-medium text-white">LKR {order.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Estimated Delivery */}
              <div className="bg-orange-900 bg-opacity-40 p-6 rounded-xl border border-orange-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-orange-300">Estimated Delivery</h3>
                    <p className="text-orange-200">
                      {order.status === 'Delivered' 
                        ? 'Your order has been delivered!' 
                        : 'Your order is on its way!'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-300">
                      {order.status === 'Delivered' ? 'Delivered' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Timeline */}
              <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Order Timeline</h2>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= getStep(order.status) 
                            ? 'bg-orange-500' 
                            : 'bg-gray-700'
                        }`}>
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-medium ${
                          index <= getStep(order.status) ? 'text-orange-400' : 'text-gray-400'
                        }`}>
                          {step}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {index === 0 && 'We received your order and are processing it.'}
                          {index === 1 && 'Our team is preparing your items for delivery.'}
                          {index === 2 && 'Your order is on the way to your location.'}
                          {index === 3 && 'Your order has been delivered successfully.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderTracking;