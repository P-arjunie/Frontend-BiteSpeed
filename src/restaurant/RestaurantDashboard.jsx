/*
import React, { useEffect, useState } from "react";
import Sidebar from "../components/RestaurantDashboardSidebar";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import UTC plugin
import timezone from "dayjs/plugin/timezone"; // Import timezone plugin

// Extend dayjs with the plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(35); // Update with actual menu items data later

  useEffect(() => {
    // Fetch restaurant profile
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/restaurant/profile/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // Fetch today's orders and calculate total orders and revenue
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        const res = await axios.get("http://localhost:5000/api/restaurant/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Orders Response:", res.data); // Log the response to check data format

        const today = dayjs().startOf("day"); // Start of the current day (midnight)

        // Filter orders that are placed today, ensuring that the order date is compared in local time
        const todayOrders = res.data.filter((order) => {
          const orderDate = dayjs(order.date).tz(dayjs.tz.guess()).startOf("day"); // Convert order date to local time and get start of the day
          return orderDate.isSame(today, "day"); // Compare dates ignoring the time
        });

        console.log("Today Orders:", todayOrders); // Log the filtered orders

        setTotalOrdersToday(todayOrders.length); // Set total orders to length of todayOrders array

        // Calculate total revenue for today's orders
        const revenue = todayOrders.reduce((sum, order) => {
          const price = parseFloat(order.price) || 0;
          const quantity = parseInt(order.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0);

        console.log("Total Revenue Today:", revenue); // Log total revenue
        setTotalRevenueToday(revenue); // Set total revenue
      } catch (err) {
        console.error("Failed to fetch today's orders:", err);
        setError("Failed to fetch orders");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Dashboard</h1>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : !profile ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-lg">
                Hello, <span className="font-semibold text-gray-800">{profile.name}</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🧾</span>
                  <div>
                    <p className="text-xl font-bold text-blue-900">{totalOrdersToday}</p>
                    <p className="text-sm text-blue-800">Orders Today</p>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <p className="text-xl font-bold text-green-900">
                      LKR {totalRevenueToday.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-800">Revenue Today</p>
                  </div>
                </div>

                <div className="bg-yellow-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🍴</span>
                  <div>
                    <p className="text-xl font-bold text-yellow-900">{totalMenuItems}</p>
                    <p className="text-sm text-yellow-800">Total Menu Items</p>
                  </div>
                </div>

                <div className="bg-red-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">⏲️</span>
                  <div>
                    <p
                      className={`text-xl font-bold capitalize ${
                        profile.status === "open" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {profile.status}
                    </p>
                    <p className="text-sm text-red-800">Current Availability</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
*/

/*
import React, { useEffect, useState } from "react";
import Sidebar from "../components/RestaurantDashboardSidebar";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(35); // Update later if needed

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/restaurant/profile/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }
  
        const res = await axios.get("http://localhost:5000/api/restaurant/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const orders = res.data;
  
        console.log("Orders Response:", orders);
  
        const today = dayjs().format("YYYY-MM-DD");
  
        const todayOrders = orders.filter((order) => {
          if (!order.date) return false;
          
          const orderDate = dayjs.utc(order.date).local().format("YYYY-MM-DD");
  
          console.log(`Order Date: ${orderDate}, Today: ${today}`); // Add this debug line
          return orderDate === today;
        });
  
        console.log("Today Orders:", todayOrders);
  
        setTotalOrdersToday(todayOrders.length);
  
        const revenue = todayOrders.reduce((sum, order) => {
          const price = parseFloat(order.price) || 0;
          const quantity = parseInt(order.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0);
  
        console.log("Total Revenue Today:", revenue);
        setTotalRevenueToday(revenue);
      } catch (err) {
        console.error("Failed to fetch today's orders:", err);
        setError("Failed to fetch orders");
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Dashboard</h1>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : !profile ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-lg">
                Hello, <span className="font-semibold text-gray-800">{profile.name}</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🧾</span>
                  <div>
                    <p className="text-xl font-bold text-blue-900">{totalOrdersToday}</p>
                    <p className="text-sm text-blue-800">Orders Today</p>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <p className="text-xl font-bold text-green-900">
                      LKR {totalRevenueToday.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-800">Revenue Today</p>
                  </div>
                </div>

                <div className="bg-yellow-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🍴</span>
                  <div>
                    <p className="text-xl font-bold text-yellow-900">{totalMenuItems}</p>
                    <p className="text-sm text-yellow-800">Total Menu Items</p>
                  </div>
                </div>

                <div className="bg-red-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">⏲️</span>
                  <div>
                    <p
                      className={`text-xl font-bold capitalize ${
                        profile.status === "open" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {profile.status}
                    </p>
                    <p className="text-sm text-red-800">Current Availability</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
*/



import React, { useEffect, useState } from "react";
import Sidebar from "../components/RestaurantDashboardSidebar";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const RestaurantDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  const [totalOrdersToday, setTotalOrdersToday] = useState(0);
  const [totalRevenueToday, setTotalRevenueToday] = useState(0);
  const [totalMenuItems, setTotalMenuItems] = useState(35); // Update later if needed

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("https://restaurant-management-service.onrender.com/api/restaurant/profile/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || "Failed to load profile");
        }
      } catch (err) {
        setError("Error fetching profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }
  
        const res = await axios.get("https://restaurant-management-service.onrender.com/api/restaurant/orders/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const orders = res.data;
  
        console.log("Orders Response:", orders);
  
        const today = dayjs().format("YYYY-MM-DD");
  
        const todayOrders = orders.filter((order) => {
          if (!order.date) return false;
          
          const orderDate = dayjs.utc(order.date).local().format("YYYY-MM-DD");
  
          console.log(`Order Date: ${orderDate}, Today: ${today}`); // Add this debug line
          return orderDate === today;
        });
  
        console.log("Today Orders:", todayOrders);
  
        setTotalOrdersToday(todayOrders.length);
  
        const revenue = todayOrders.reduce((sum, order) => {
          const price = parseFloat(order.price) || 0;
          const quantity = parseInt(order.quantity, 10) || 0;
          return sum + price * quantity;
        }, 0);
  
        console.log("Total Revenue Today:", revenue);
        setTotalRevenueToday(revenue);
      } catch (err) {
        console.error("Failed to fetch today's orders:", err);
        setError("Failed to fetch orders");
      }
    };
  
    fetchOrders();
  }, []);
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Restaurant Dashboard</h1>

          {error ? (
            <p className="text-red-500">{error}</p>
          ) : !profile ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-8 text-lg">
                Hello, <span className="font-semibold text-gray-800">{profile.name}</span>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🧾</span>
                  <div>
                    <p className="text-xl font-bold text-blue-900">{totalOrdersToday}</p>
                    <p className="text-sm text-blue-800">Orders Today</p>
                  </div>
                </div>

                <div className="bg-green-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <p className="text-xl font-bold text-green-900">
                      LKR {totalRevenueToday.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-800">Revenue Today</p>
                  </div>
                </div>

                <div className="bg-yellow-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">🍴</span>
                  <div>
                    <p className="text-xl font-bold text-yellow-900">{totalMenuItems}</p>
                    <p className="text-sm text-yellow-800">Total Menu Items</p>
                  </div>
                </div>

                <div className="bg-red-100 p-6 rounded-2xl shadow flex items-center gap-4">
                  <span className="text-3xl">⏲️</span>
                  <div>
                    <p
                      className={`text-xl font-bold capitalize ${
                        profile.status === "open" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {profile.status}
                    </p>
                    <p className="text-sm text-red-800">Current Availability</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboard;
