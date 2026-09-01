import React, { useEffect, useState } from "react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get token from localStorage
  const getToken = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.token || null;
    } catch (error) {
      return null;
    }
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Admin authentication token not found.");
      }

      const response = await fetch("/api/orders", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      // Your backend returns orders directly
      setOrders(Array.isArray(data) ? data : data.orders || []);

    } catch (error) {
      console.error("Fetch orders error:", error);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = getToken();

      if (!token) {
        alert("Authentication token not found.");
        return;
      }

      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update order status"
        );
      }

      // Update order in UI
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: data.order?.status || status }
            : order
        )
      );

      alert("Order status updated successfully!");

    } catch (error) {
      console.error("Update order error:", error);
      alert(error.message || "Failed to update order status");
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${Number(price || 0).toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <h1>Orders</h1>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">

      <div className="admin-header">
        <div>
          <h1>Orders</h1>
          <p>Manage all customer orders</p>
        </div>

        <button
          onClick={fetchOrders}
          className="refresh-btn"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error">
          {error}
        </div>
      )}

      <div className="admin-card">

        <div className="orders-count">
          <strong>Total Orders: {orders.length}</strong>
        </div>

        {orders.length === 0 ? (
          <div className="empty-admin-data">
            <h2>No Orders Found</h2>
            <p>No customer orders have been placed yet.</p>
          </div>
        ) : (

          <div className="table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {orders.map((order) => (

                  <tr key={order._id}>

                    {/* Order ID */}
                    <td>
                      #{order._id.slice(-8)}
                    </td>


                    {/* Customer */}
                    <td>

                      <div className="customer-info">

                        <strong>
                          {order.user?.name || "Unknown User"}
                        </strong>

                        <br />

                        <small>
                          {order.user?.email || "No email"}
                        </small>

                      </div>

                    </td>


                    {/* Number of items */}
                    <td>
                      {order.items?.length || 0}
                    </td>


                    {/* Total */}
                    <td>
                      <strong className="order-price">
                        {formatPrice(order.totalAmount)}
                      </strong>
                    </td>


                    {/* Status */}
                    <td>

                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="status-select"
                      >

                        <option value="pending">
                          Pending
                        </option>

                        <option value="processing">
                          Processing
                        </option>

                        <option value="shipped">
                          Shipped
                        </option>

                        <option value="delivered">
                          Delivered
                        </option>

                        <option value="cancelled">
                          Cancelled
                        </option>

                      </select>

                    </td>


                    {/* Date */}
                    <td>
                      {formatDate(order.createdAt)}
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

export default AdminOrders;
