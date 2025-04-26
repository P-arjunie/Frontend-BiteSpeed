import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RestaurantLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://auth-service-2-4xm3.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (res.ok && result.token) {
        console.log("Token:", result.token);
        localStorage.setItem('restaurantToken', result.token);
        setMessage("Login successful!");
        navigate('/restaurant/dashboard');
      } else {
        setMessage(result.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-white"></div>

      {/* Right Side */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md"
            />
            <button type="submit" className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700">
              Login
            </button>
          </form>
          {message && <p className="text-center text-red-500 mt-4">{message}</p>}

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register-restaurant" className="text-green-600 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLogin;
