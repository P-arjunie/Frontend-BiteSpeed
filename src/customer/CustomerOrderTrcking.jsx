import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerOrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [intervalId, setIntervalId] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`https://ordermanagementservice.onrender.com/api/orders/${orderId}`);
      setOrder(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Order not found. Please check the ID.');
      setOrder(null);
    }
  };

  useEffect(() => {
    if (orderId) {
      const id = setInterval(fetchOrder, 2000); // Fetch every 5 seconds
      setIntervalId(id);
    }
    return () => clearInterval(intervalId); // Clear when component unmounts
  }, [orderId]);

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

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Customer Order Tracking</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <button
          onClick={fetchOrder}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Fetch Order
        </button>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {order && (
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p><strong>Customer Name:</strong> {order.userDistance.customerName}</p>
          <p><strong>Phone:</strong> {order.userDistance.phone}</p>
          <p><strong>Address:</strong> {order.userDistance.address}</p>
          <p><strong>Item:</strong> {order.itemName}</p>
          <p><strong>Quantity:</strong> {order.quantity}</p>
          <p><strong>Price (LKR):</strong> {order.price}</p>
          <p><strong>Status:</strong> {order.status}</p>

          {/* Step Bar */}
          <div className="flex mt-6">
            {['Waiting for Accepted', 'Preparing Order', 'Out for Delivery', 'Delivered'].map((step, index) => (
              <div key={index} className="flex-1 text-center">
                <div
                  className={`p-2 rounded-full ${
                    index <= getStep(order.status) ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
                  }`}
                >
                  {step}
                </div>
                {index !== 3 && <div className="h-1 bg-gray-300 my-2"></div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrderTracking;
