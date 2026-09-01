import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/adminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check login
    if (!user) {
      navigate("/login");
      return;
    }

    // Check admin role
    if (user.role !== "admin") {
      alert("Access denied! Admin only.");
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/analytics/dashboard", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch dashboard data"
          );
        }

        setStats({
          totalUsers: data.totalUsers || 0,
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0,
        });

      } catch (error) {
        console.error("Dashboard Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

  }, [user, navigate]);


  if (loading) {
    return (
      <div className="admin-loading">
        Loading Dashboard...
      </div>
    );
  }


  return (
    <div className="admin-dashboard">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="admin-logo">
          ShopNest
          <span>Admin</span>
        </div>


        <nav className="admin-nav">

          <button
            className="admin-nav-item active"
            onClick={() => navigate("/admin")}
          >
            📊 Dashboard
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/products")}
          >
            🛍️ Products
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/orders")}
          >
            📦 Orders
          </button>


          <button
            className="admin-nav-item"
            onClick={() => navigate("/admin/users")}
          >
            👥 Users
          </button>

        </nav>


        <button
          className="admin-back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Store
        </button>

      </aside>



      {/* MAIN CONTENT */}
      <main className="admin-main">

        {/* HEADER */}
        <div className="admin-header">

          <div>
            <p className="admin-welcome">
              Welcome back, {user?.name || "Admin"}
            </p>

            <h1>Admin Dashboard</h1>
          </div>


          <div className="admin-date">
            {new Date().toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>

        </div>



        {/* STATISTICS */}
        <div className="admin-stats">

          {/* USERS */}
          <div className="admin-stat-card">

            <div className="stat-icon">👥</div>

            <div>
              <p>Total Users</p>

              <h2>{stats.totalUsers}</h2>
            </div>

          </div>



          {/* ORDERS */}
          <div className="admin-stat-card">

            <div className="stat-icon">📦</div>

            <div>
              <p>Total Orders</p>

              <h2>{stats.totalOrders}</h2>
            </div>

          </div>



          {/* PRODUCTS */}
          <div className="admin-stat-card">

            <div className="stat-icon">🛍️</div>

            <div>
              <p>Total Products</p>

              <h2>{stats.totalProducts}</h2>
            </div>

          </div>



          {/* REVENUE */}
          <div className="admin-stat-card">

            <div className="stat-icon">💰</div>

            <div>
              <p>Total Revenue</p>

              <h2>
                ₹{Number(stats.totalRevenue).toLocaleString("en-IN")}
              </h2>
            </div>

          </div>

        </div>



        {/* QUICK ACTIONS */}
        <section className="admin-section">

          <h2>Quick Actions</h2>

          <div className="admin-actions">

            <button
              onClick={() => navigate("/admin/products")}
            >
              ➕ Manage Products
            </button>


            <button
              onClick={() => navigate("/admin/orders")}
            >
              📦 Manage Orders
            </button>


            <button
              onClick={() => navigate("/admin/users")}
            >
              👥 Manage Users
            </button>

          </div>

        </section>

      </main>

    </div>
  );
};

export default AdminDashboard;