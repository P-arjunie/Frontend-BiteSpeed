// src/pages/OrderSummary.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const OrderSummary = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const promotionDiscount = subtotal * 0.4;
  const deliveryFee = 99;
  const serviceFee = 70;
  const total = subtotal - promotionDiscount + deliveryFee + serviceFee;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-sm">
      {/* Header */}
      <header className="w-full bg-white py-2 px-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <img
              src="/path-to-cafe-image.jpg"
              alt="Cafe Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="text-base font-bold text-gray-800">Hogwarts Cafe</h1>
              <p className="text-xs text-gray-500">213/2 Kandy road kiribathgoda</p>
            </div>
          </div>
        </div>
      </header>

      {/* Promotion Banner */}
      <div className="bg-yellow-100 text-center py-2 px-4 mt-3 mx-3 rounded-lg shadow-sm flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-sm font-semibold text-gray-800">Save LKR 99.00 on this order</h2>
          <p className="text-xs text-gray-600">Get yours now</p>
        </div>
        <img
          src="/path-to-burger-image.jpg"
          alt="Promotion"
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      {/* Place Order Button */}
      <div className="mt-4 mx-3">
        <button className="w-full bg-black text-white py-3 rounded-lg text-base font-semibold hover:bg-gray-800 transition">
          Place Order
        </button>
      </div>

      {/* Cart Summary */}
      <div className="mt-4 mx-3 bg-white p-4 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold mb-3 text-gray-700">Cart ({cartItems.length})</h2>

        {/* Items */}
        <div className="flex flex-col gap-2">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-gray-700">
              <div>{item.name} × {item.quantity}</div>
              <div className="text-green-700 font-semibold">Rs. {(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotion */}
      <div className="mt-3 mx-3 bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-md font-semibold text-gray-700 mb-1">Promotion</h3>
        <p className="text-xs text-green-600 font-medium">Promotion applied: 40% off</p>
      </div>

      {/* Order Total */}
      <div className="mt-3 mx-3 bg-white p-4 rounded-xl shadow-sm mb-10">
        <h2 className="text-lg font-bold text-gray-700 mb-3">Order Total</h2>

        <div className="flex justify-between text-gray-600 text-sm mb-1">
          <span>Subtotal</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-red-600 font-semibold mb-1">
          <span>Promotion</span>
          <span>-LKR {promotionDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm mb-1">
          <span>Delivery Fee</span>
          <span>LKR {deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm mb-3">
          <span>Service Fee</span>
          <span>LKR {serviceFee.toFixed(2)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
