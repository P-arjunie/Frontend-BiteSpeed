import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  }, [cartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`💳 Payment of $${totalAmount.toFixed(2)} is being processed.`);
    // Add your payment logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-repeat" 
               style={{
                 backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
               }}
          ></div>
        </div>
        
        {/* Gradient Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-purple-200/20 rounded-full blur-xl"></div>
      </div>

      {/* Header */}
      <header className="w-full bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6 rounded-xl mb-8 shadow-lg z-10 relative mx-4 mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <span className="text-yellow-300 mr-2">💳</span> BiteSpeed Pay
          </h1>
          <nav className="space-x-4 hidden sm:block">
            <Link to="/customer-home" className="text-blue-200 hover:text-white transition">Home</Link>
            <Link to="/orders" className="text-blue-200 hover:text-white transition">My Orders</Link>
            <Link to="/profile" className="text-blue-200 hover:text-white transition">Profile</Link>
          </nav>
        </div>
      </header>

      {/* Main Payment Container */}
      <main className="max-w-4xl mx-auto px-4 w-full mb-12 z-10 relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-blue-100">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 flex items-center">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
              <p className="text-blue-200 text-sm">Your transaction is secured by 256-bit encryption</p>
            </div>
          </div>

          <div className="p-8">
            {/* Order Summary */}
            <div className="mb-8 bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <span className="mr-2">🧾</span> Order Summary
              </h2>
              
              {cartItems.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No items in cart
                </div>
              ) : (
                <>
                  <ul className="space-y-3 text-gray-700">
                    {cartItems.map((item, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-blue-100 pb-3">
                        <div className="flex items-center">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-10 h-10 rounded object-cover mr-3" 
                            />
                          )}
                          <span>{item.name} × {item.quantity}</span>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4 flex justify-between items-center pt-3 border-t border-blue-200">
                    <span className="text-lg font-medium text-gray-700">Total Amount:</span>
                    <span className="text-lg font-bold text-blue-700">${totalAmount.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Credit Card Icons */}
            <div className="flex justify-center mb-6 space-x-4">
              <div className="w-12 h-8 bg-blue-900 rounded-md shadow-sm flex items-center justify-center text-white text-xs font-bold">VISA</div>
              <div className="w-12 h-8 bg-red-600 rounded-md shadow-sm flex items-center justify-center text-white text-xs font-bold">MC</div>
              <div className="w-12 h-8 bg-green-700 rounded-md shadow-sm flex items-center justify-center text-white text-xs font-bold">AMEX</div>
              <div className="w-12 h-8 bg-gray-800 rounded-md shadow-sm flex items-center justify-center text-white text-xs font-bold">OTHER</div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="John Smith"
                    value={paymentInfo.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentInfo.cardNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-1/2 relative">
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>

                <div className="w-1/2 relative">
                  <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      value={paymentInfo.cvv}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-700">
                  Your payment information is encrypted and secure. We never store your full card details.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 mt-6 shadow-lg flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Pay Securely ${totalAmount.toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl shadow-lg px-6 py-8 z-10 relative mx-4 mb-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-semibold text-white">
              <span className="text-yellow-300">💳</span> BiteSpeed Pay
            </h2>
            <p className="text-sm mt-2 text-blue-200">Secure payments for your favorite meals since 2025.</p>
          </div>
      
          {/* Navigation Section */}
          <div className="flex space-x-6 text-lg">
            <Link to="/customer-home" className="text-blue-200 hover:text-white transition">Home</Link>
            <Link to="/orders" className="text-blue-200 hover:text-white transition">My Orders</Link>
            <Link to="/profile" className="text-blue-200 hover:text-white transition">Profile</Link>
            <Link to="/about" className="text-blue-200 hover:text-white transition">About Us</Link>
            <Link to="/contact" className="text-blue-200 hover:text-white transition">Contact</Link>
          </div>
        </div>

        {/* Footer Text Section */}
        <div className="mt-8 border-t border-indigo-700 pt-6 text-center text-gray-300">
          <p className="text-lg">© 2025 BiteSpeed. All rights reserved.</p>
          <p className="mt-2 text-sm flex items-center justify-center gap-2">
            <span>Secured by</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>BiteSpeed Secure</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PaymentPage;