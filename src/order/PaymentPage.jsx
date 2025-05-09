import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CreditCard, Home, Package, User, Lock, Check, X } from 'lucide-react';

const PaymentPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];
  const totalPrice = location.state?.totalPrice || 0;

  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    if (!value) return value;
    const cardNumber = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    
    for (let i = 0; i < cardNumber.length && i < 16; i += 4) {
      parts.push(cardNumber.substring(i, i + 4));
    }
    
    return parts.join(' ');
  };

  // Format expiry date with slash
  const formatExpiryDate = (value) => {
    if (!value) return value;
    const expiry = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (expiry.length <= 2) {
      return expiry;
    }
    
    return `${expiry.substring(0, 2)}/${expiry.substring(2, 4)}`;
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setPaymentInfo((prev) => ({
      ...prev,
      cardNumber: formattedValue,
    }));
  };

  const handleExpiryChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value);
    setPaymentInfo((prev) => ({
      ...prev,
      expiryDate: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
    
    // Show processing toast
    setToastMessage('Processing your Order...');
    setShowToast(true);
    
    try {
      // Prepare payment data to send to backend
      const paymentData = {
        amount: totalPrice,
        name: paymentInfo.name,
        cardNumber: paymentInfo.cardNumber.replace(/\s/g, ''), // Remove spaces
        expiryDate: paymentInfo.expiryDate,
        cvv: paymentInfo.cvv
      };
      
      // Add a simulated delay of 10 seconds to show the processing toast
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Send payment data to backend API
      const response = await fetch('https://paymentservicebackend.onrender.com/api/payments/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });
      
      if (!response.ok) {
        throw new Error('Payment failed. Please try again.');
      }
      
      const data = await response.json();
      
      // Update toast message for success
      setToastMessage('Payment processed successfully!');
      
      // Payment successful
      setIsProcessing(false);
      setIsComplete(true);
    } catch (error) {
      setIsProcessing(false);
      setError(error.message || 'Something went wrong. Please try again.');
      
      // Update toast for error
      setToastMessage('Payment failed. Please try again.');
      setShowToast(true);
      
      console.error('Payment error:', error);
    }
  };

  // Handle toast timeout - longer for processing state
  useEffect(() => {
    if (showToast && !isProcessing) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast, isProcessing]);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Your payment of ${totalPrice.toFixed(2)} has been processed successfully.</p>
          <Link to="/customer-home">
            <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-medium">
              Return to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Toast Notification */}
      {/* {showToast && (
        <div className={`fixed top-4 right-4 z-50 ${isProcessing ? 'bg-green-500' : error ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-3 rounded-lg shadow-lg flex items-center transition-all duration-300 ease-in-out`}>
          {isProcessing ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : error ? (
            <X className="mr-2" size={18} />
          ) : (
            <Check className="mr-2" size={18} />
          )}
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="ml-3 text-white hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      )} */}
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/customer-home" className="flex items-center">
            <div className="bg-orange-500 text-white p-2 rounded-md mr-2">
              <CreditCard size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">SecurePay</h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/customer-home" className="flex items-center text-gray-600 hover:text-orange-500">
              <Home size={18} className="mr-1" />
              <span>Home</span>
            </Link>
            <Link to="/orders" className="flex items-center text-gray-600 hover:text-orange-500">
              <Package size={18} className="mr-1" />
              <span>Orders</span>
            </Link>
            <Link to="/profile" className="flex items-center text-gray-600 hover:text-orange-500">
              <User size={18} className="mr-1" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Order Summary */}
          <div className="w-full md:w-2/5 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-orange-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Order Summary</h2>
            </div>
            <div className="p-6">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No items in cart.</p>
              ) : (
                <>
                  <ul className="space-y-4 mb-6">
                    {cartItems.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center border-b pb-4">
                        <div className="flex items-center">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-md mr-4 object-cover" />
                          )}
                          <div>
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-800">free</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t border-gray-200 mt-2">
                    <span>Total</span>
                    <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="w-full md:w-3/5 bg-white rounded-xl shadow-md">
            <div className="bg-orange-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Payment Details</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-gray-600">
                  <Lock size={16} className="mr-2" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex space-x-2">
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  <div className="w-10 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="(ex:)John Smith"
                    value={paymentInfo.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="xxxx xxxx xxx xxxx"
                    value={paymentInfo.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      placeholder="---"
                      value={paymentInfo.cvv}
                      onChange={handleInputChange}
                      maxLength={4}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-orange-500 text-white py-4 rounded-lg hover:bg-orange-600 transition font-medium flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing you Order...
                      </>
                    ) : (
                      `Pay $${totalPrice.toFixed(2)}`
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;