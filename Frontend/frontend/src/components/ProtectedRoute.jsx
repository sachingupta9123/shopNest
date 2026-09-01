import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  // User login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Sirf admin routes ke liye
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;