import React, { useState, useEffect } from 'react';

const AddVehicle = () => {
  const [vehicleData, setVehicleData] = useState({
    number: '',
    model: '',
    color: '',
    year: '',
  });

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('http://localhost:5000/api/drivers/vehicle/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('✅ Vehicle added successfully!');
        setVehicleData({ number: '', model: '', color: '', year: '' });
        fetchVehicles();
        setShowForm(false);
      } else {
        setError(data.message || '❌ Failed to add vehicle.');
      }
    } catch (err) {
      setError('❌ Error adding vehicle.');
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/drivers/vehicle/my-vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setVehicles(data);
      } else {
        setError(data.message || 'Failed to fetch vehicles.');
      }
    } catch (err) {
      setError('Error fetching vehicles.');
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Your Vehicles</h2>

      {success && <div className="bg-green-100 text-green-800 p-3 mb-4 rounded-md">{success}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 mb-4 rounded-md">{error}</div>}

      <ul className="space-y-4 mb-6">
        {vehicles.length > 0 ? (
          vehicles.map((vehicle) => (
            <li key={vehicle._id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
              <p><span className="font-medium text-gray-700">Number:</span> {vehicle.number}</p>
              <p><span className="font-medium text-gray-700">Model:</span> {vehicle.model}</p>
              <p><span className="font-medium text-gray-700">Color:</span> {vehicle.color}</p>
              <p><span className="font-medium text-gray-700">Year:</span> {vehicle.year}</p>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No vehicles found.</p>
        )}
      </ul>

      {!showForm && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition"
          >
            Add New Vehicle
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add Vehicle</h3>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Vehicle Number</label>
            <input
              type="text"
              name="number"
              value={vehicleData.number}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={vehicleData.model}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Bike Color</label>
            <input
              type="text"
              name="color"
              value={vehicleData.color}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Year</label>
            <input
              type="number"
              name="year"
              value={vehicleData.year}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddVehicle;
