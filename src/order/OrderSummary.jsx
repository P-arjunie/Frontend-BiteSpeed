import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaStore, FaShoppingBag, FaCheck, FaArrowLeft } from 'react-icons/fa';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItem, restaurantId } = location.state || {};
  const [restaurant, setRestaurant] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch customer profile data
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You need to login first');
        navigate('/login');
        return;
      }
      
      const response = await fetch('https://customer-service-lqm4.onrender.com/api/customers/profile', {
        method: 'GET',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      setError('Error fetching profile data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Fetch restaurant data
  useEffect(() => {
    if (restaurantId) {
      axios
        .get(`https://restaurant-management-service.onrender.com/api/restaurant/${restaurantId}`)
        .then(res => setRestaurant(res.data))
        .catch(err => console.error(err));
    }
  }, [restaurantId]);

  const subtotal = cartItem?.price * cartItem?.quantity || 0;
  const promotionDiscount = subtotal * 0.4;
  const deliveryFee = 99;
  const serviceFee = 70;
  const total = subtotal - promotionDiscount + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    const orderData = {
      userId: userProfile?._id || "",
      userLocation: userProfile?.location || "",
      customerName: userProfile?.name || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      email: userProfile?.email || "",
      resturantId: restaurantId,
      resturantLocation: restaurant?.location || "",
      resturantDistance: restaurant?.distance || { latitude: 0, longitude: 0 },
      mealId: cartItem._id,
      itemName: cartItem.itemName,
      quantity: cartItem.quantity,
      price: cartItem.price,
      totalPrice: total,
      driverId: "",
      driverLocation: "",
      driverName: "",
      status: "Pending"
    };

    try {
      const res = await axios.post("https://ordermanagementservice.onrender.com/api/orders/", orderData);
      if (res.status === 200 || res.status === 201) {
        alert("Procced Your Payment..!");
        // Pass the total price to the payment page
        navigate('/payment', { 
          state: { 
            totalAmount: total,
            cartItems: [cartItem] // Pass the cart item as well
          } 
        });
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Order failed. Try again.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md flex items-center space-x-4">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-gray-700">Loading profile...</p>
      </div>
    </div>
  );
  
  if (!cartItem) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <div className="text-orange-500 text-5xl mb-4">😕</div>
        <p className="text-lg font-medium text-gray-700">No item found in cart</p>
        <button 
          onClick={() => navigate('/customer-home')}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-lg font-medium text-gray-700">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-lg transition-all duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaShoppingBag className="text-white text-2xl mr-3" />
              <h1 className="text-2xl font-bold text-white">Order Summary</h1>
            </div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-white hover:text-orange-100 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Complete Your Order</h2>
          <p className="text-gray-500 text-center mt-2">Please review your order details before proceeding to payment</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-orange-500 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <FaUser className="text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Customer Information</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex border-b border-gray-100 pb-2">
                  <span className="w-24 font-medium text-gray-500">Name:</span>
                  <span className="flex-1 text-gray-800 font-medium">{userProfile?.name}</span>
                </div>
                <div className="flex border-b border-gray-100 pb-2">
                  <span className="w-24 font-medium text-gray-500">Email:</span>
                  <span className="flex-1 text-gray-800">{userProfile?.email}</span>
                </div>
                <div className="flex border-b border-gray-100 pb-2">
                  <span className="w-24 font-medium text-gray-500">Phone:</span>
                  <span className="flex-1 text-gray-800">{userProfile?.phone}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium text-gray-500">Address:</span>
                  <span className="flex-1 text-gray-800">{userProfile?.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Information Card */}
          <div className="bg-white rounded-lg shadow-md border-t-4 border-orange-500 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <FaStore className="text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Restaurant Information</h3>
              </div>
              
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={restaurant?.image || "/placeholder.png"}
                    alt="Restaurant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-800">{restaurant?.name || "Restaurant Name"}</h4>
                  <p className="text-sm text-gray-500 mt-1">{restaurant?.address || "Restaurant Address"}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium ml-1 text-gray-600">{restaurant?.rating || "4.5"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-100">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                  <FaShoppingBag className="text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
              </div>
              
              {/* Order Item */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="bg-white rounded-md p-2 mr-4 shadow-sm">
                      {cartItem?.image ? (
                        <img src={cartItem.image} alt={cartItem.itemName} className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-orange-100 rounded flex items-center justify-center">
                          <FaShoppingBag className="text-orange-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{cartItem?.itemName}</h4>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Rs. {cartItem?.price}</span> × {cartItem?.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-gray-800">
                    Rs. {(cartItem?.price * cartItem?.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium flex items-center">
                  Promotion Discount (40%)
                </span>
                <span className="font-medium text-green-600">- Rs. {promotionDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium text-gray-800">Rs. {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-gray-800">Rs. {serviceFee.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-orange-600">Rs. {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="py-3 px-6 bg-white border border-orange-500 text-orange-500 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-300 flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Cart
          </button>
          
          <button
            onClick={handlePlaceOrder}
            className="py-3 px-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md flex items-center justify-center"
          >
            <FaCheck className="mr-2" /> Confirm Order
          </button>
        </div>

        {/* Payment Security Notice */}
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-600">
            By placing your order, you agree to our Terms of Service and Privacy Policy.
            Your payment information is processed securely.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-gray-500 text-center text-sm">
            © {new Date().getFullYear()} Your Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;