import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/orderSuccessful.css';

const OrderSuccessful = () => {
  return (
    <div className="order-success-page">

      <div className="order-success-card">

        <div className="success-icon">
          ✓
        </div>

        <h1>Order Successful!</h1>

        <p className="success-message">
          Thank you for shopping with ShopNest.
        </p>

        <p className="success-submessage">
          Your order has been placed successfully.
        </p>

        <Link
          to="/"
          className="success-shop-btn"
        >
          Continue Shopping
        </Link>

      </div>

    </div>
  );
};

export default OrderSuccessful;