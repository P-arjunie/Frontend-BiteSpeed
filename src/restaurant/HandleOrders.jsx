/*
import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from '../components/RestaurantDashboardSidebar';

const HandleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/restaurant/orders/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("restaurantToken");
      const res = await fetch(`http://localhost:5000/api/restaurant/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: data.updatedOrder.status } : order
          )
        );
      } else {
        alert(data.message || "Error updating order status.");
      }
    } catch (error) {
      alert("Error updating order status.");
    }
  };

  const statusOptions = ["Accepted", "Out for Delivery", "Delivered"];

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.orderId} className="border-t hover:bg-gray-50">
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">{order.itemName}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">Rs. {order.price}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        order.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                        order.status === "Accepted" ? "bg-blue-200 text-blue-800" :
                        order.status === "Out for Delivery" ? "bg-orange-200 text-orange-800" :
                        order.status === "Delivered" ? "bg-green-200 text-green-800" :
                        "bg-gray-200 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.status !== "Delivered" && (
                        <select
                          onChange={(e) => updateStatus(order.orderId, e.target.value)}
                          defaultValue=""
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="" disabled>Update Status</option>
                          {statusOptions
                            .filter((s) => s !== order.status)
                            .map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleOrders;
*/

import React, { useEffect, useState } from "react";
import RestaurantDashboardSidebar from "../components/RestaurantDashboardSidebar";

const HandleOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("restaurantToken");
        if (!token) {
          setError("No token found. Please log in again.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/restaurant/orders/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("restaurantToken");
      const res = await fetch(`http://localhost:5000/api/restaurant/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: data.updatedOrder.status } : order
          )
        );
      } else {
        alert(data.message || "Error updating order status.");
      }
    } catch (error) {
      alert("Error updating order status.");
    }
  };

  const statusOptions = ["Accepted", "Out for Delivery", "Delivered"];
  const filterOptions = ["All", "Pending", "Accepted", "Out for Delivery", "Delivered"];

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="flex">
      <RestaurantDashboardSidebar />
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {filterOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Loading, Error, and Orders Table */}
        {loading ? (
          <p>Loading orders...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredOrders.length === 0 ? (
          <p>No orders found for selected filter.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow-md">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-left">
                  <th className="p-3">Customer</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.orderId} className="border-t hover:bg-gray-50">
                    <td className="p-3">{order.customerName}</td>
                    <td className="p-3">{order.itemName}</td>
                    <td className="p-3">{order.quantity}</td>
                    <td className="p-3">Rs. {order.price}</td>
                    <td className="p-3">{order.address}</td>
                    <td className="p-3">{order.phone}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          order.status === "Pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : order.status === "Accepted"
                            ? "bg-blue-200 text-blue-800"
                            : order.status === "Out for Delivery"
                            ? "bg-orange-200 text-orange-800"
                            : order.status === "Delivered"
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {order.status !== "Delivered" && (
                        <select
                          onChange={(e) => updateStatus(order.orderId, e.target.value)}
                          defaultValue=""
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="" disabled>
                            Update Status
                          </option>
                          {statusOptions
                            .filter((s) => s !== order.status)
                            .map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleOrders;



