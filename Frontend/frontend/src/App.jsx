import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Disclaimer from "./pages/Disclaimer";
import ReturnPolicy from "./pages/returnpolicy";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccessful from "./pages/OrderSuccessful";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";

// Admin section
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminProducts from "./admin/AdminProducts";
import AdminUsers from "./admin/AdminUsers";
import EditProducts from "./admin/EditProducts";
import AddProduct from "./admin/AddProduct";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}

            <Route path="/" element={<Home />} />

            <Route path="/about" element={<About />} />

            <Route path="/disclaimer" element={<Disclaimer />} />

            <Route path="/returns" element={<ReturnPolicy />} />

            <Route path="/register" element={<Register />} />

            <Route path="/product/:id" element={<ProductDetail />} />

            <Route path="/login" element={<Login />} />

            <Route path="/verify-otp" element={<VerifyOTP />} />

            <Route path="/cart" element={<Cart />} />

            <Route path="/checkout" element={<Checkout />} />

            <Route
              path="/order-success"
              element={<OrderSuccessful />}
            />

            <Route path="/profile" element={<Profile />} />

            <Route path="/orders" element={<MyOrders />} />


            {/* ================= ADMIN PROTECTED ROUTES ================= */}

            <Route element={<ProtectedRoute adminOnly={true} />}>

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/admin/orders"
                element={<AdminOrders />}
              />

              <Route
                path="/admin/products"
                element={<AdminProducts />}
              />

              <Route
                path="/admin/users"
                element={<AdminUsers />}
              />

              <Route
                path="/admin/products/edit/:id"
                element={<EditProducts />}
              />

              <Route
                path="/admin/products/add"
                element={<AddProduct />}
              />

            </Route>

          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;