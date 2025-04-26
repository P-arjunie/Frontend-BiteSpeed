/*import React, { useState } from 'react';

const RestaurantRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: null,
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register restaurant only in local backend
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('image', formData.image);

      const res = await fetch('http://localhost:5000/api/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Restaurant registered successfully.");
        setFormData({
          name: '', address: '', phone: '', email: '', password: '', image: null
        });
      } else {
        setMessage(result.message || "Restaurant registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
    }
  };

  return (
    <div className="flex min-h-screen">
     
      <div className="w-1/2 bg-white"></div>
 
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="file" name="image" accept="image/*" onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</button>
          </form>
          {message && <p className="text-center bg-gray-100 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegisterForm;
*/

import React, { useState } from 'react';

const RestaurantRegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    image: null,
    cuisineType: '',
  });

  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('phone', formData.phone);
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('cuisineType', formData.cuisineType);
      data.append('image', formData.image);

      const res = await fetch('http://localhost:5000/api/restaurant/register', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Restaurant registered successfully.");
        setFormData({
          name: '', address: '', phone: '', email: '', password: '', image: null, cuisineType: ''
        });
        setImagePreview(null);
      } else {
        setMessage(result.message || "Restaurant registration failed.");
      }
    } catch (err) {
      setMessage("Error connecting to backend.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Half */}
      <div className="w-1/2 bg-white"></div>

      {/* Right Half with Form */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Restaurant Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
            <input name="name" placeholder="Restaurant Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-md" />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-md" />

            <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} required className="w-full p-3 border rounded-md">
              <option value="">Select Cuisine Type</option>
              <option value="Sri Lankan">Sri Lankan</option>
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="Thai">Thai</option>
            </select>

            <input type="file" name="image" accept="image/*" onChange={handleChange} required className="w-full p-3 border rounded-md" />

            {/* Image Preview */}
            {imagePreview && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mt-2">Image Preview:</p>
                <img src={imagePreview} alt="Preview" className="w-full max-h-48 object-contain mt-2 border rounded" />
              </div>
            )}

            <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Register</button>
          </form>

          {message && <p className="text-center bg-gray-100 mt-4">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegisterForm;
