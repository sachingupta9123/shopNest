import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";
import { clearCart } from "../redux/cartSlice";
import {
  clearBuyNow,
  decreaseBuyNowQuantity,
  increaseBuyNowQuantity,
} from "../redux/checkoutSlice";

import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useContext(AuthContext);

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );
  const buyNowItem = useSelector((state) => state.checkout.buyNowItem);
  const isBuyNow = new URLSearchParams(location.search).get("mode") === "buy-now" && Boolean(buyNowItem);
  const checkoutItems = isBuyNow ? [buyNowItem] : cartItems;

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Calculate Total
  const totalAmount = checkoutItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Place Order
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Check Login
    if (!user || !user.token) {
      alert("Please login before placing an order.");
      navigate("/login", {
        state: {
          from: {
            pathname: "/checkout",
            search: location.search,
          },
        },
      });
      return;
    }

    // Check Cart
    if (checkoutItems.length === 0) {
      alert("There are no items to check out.");
      navigate("/cart");
      return;
    }

    try {
      setLoading(true);

      // Convert Cart Items to Backend Format
      const orderItems = checkoutItems.map((item) => ({
        product: item._id,
        qty: item.quantity,
      }));

      const orderData = {
        items: orderItems,
        address: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${user.token}`,
        },

        body: JSON.stringify(orderData),
      });

      /*
        SAFE RESPONSE HANDLING

        This prevents:
        Unexpected end of JSON input
      */

      const text = await response.text();

      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (error) {
          console.error("Invalid JSON from backend:", error);
        }
      }

      // Backend Error
      if (!response.ok) {
        alert(
          data.message ||
            `Order failed. Status: ${response.status}`
        );

        return;
      }

      console.log("Order Successful:", data);

      if (isBuyNow) {
        dispatch(clearBuyNow());
      } else {
        dispatch(clearCart());
      }

      // Navigate to Success Page
      navigate("/order-success", {
        state: {
          order: data.order,
          totalAmount: data.order?.totalAmount ?? totalAmount,
        },
      });

    } catch (error) {
      console.error("Order Error:", error);

      alert(
        error.message ||
          "Something went wrong while placing the order."
      );

    } finally {
      setLoading(false);
    }
  };

  // Empty Cart
  if (checkoutItems.length === 0) {
    return (
      <div className="checkout-page">

        <div className="empty-checkout">

          <h1>Your Cart is Empty</h1>

          <p>
            Add products before proceeding to checkout.
          </p>

          <Link
            to="/"
            className="checkout-shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-container">

        {/* Header */}

        <div className="checkout-header">

          <Link
            to={isBuyNow ? `/product/${buyNowItem._id}` : "/cart"}
            className="back-to-cart"
          >
            {isBuyNow ? "← Back to Product" : "← Back to Cart"}
          </Link>

          <h1>Checkout</h1>

        </div>

        <div className="checkout-content">

          {/* Checkout Form */}

          <div className="checkout-form-box">

            <h2>Shipping Information</h2>

            <form onSubmit={handlePlaceOrder}>

              {/* Full Name */}

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* Address */}

              <div className="form-group">

                <label>Street Address</label>

                <textarea
                  name="street"
                  placeholder="House number, street, area"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />

              </div>


              {/* City + State */}

              <div className="form-row">

                <div className="form-group">

                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>State</label>

                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Pincode + Country */}

              <div className="form-row">

                <div className="form-group">

                  <label>Pincode</label>

                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Enter pincode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>Country</label>

                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* Demo Payment */}

              <div className="demo-payment">

                <h3>Demo Payment</h3>

                <p>
                  Payment gateway is currently running in demo mode.
                </p>

                <p>
                  Amount: ₹{totalAmount.toFixed(2)}
                </p>

              </div>


              {/* Button */}

              <button type="submit" className="place-order-btn" disabled={loading} >
                     {loading ? "Processing Order..." : `Place Order • ₹${totalAmount}`}
               </button>

            </form>

          </div>


          {/* Order Summary */}

          <div className="checkout-summary">

            <h2>Order Summary</h2>


            {/* Products */}

            <div className="checkout-products">

              {checkoutItems.map((item) => (

                <div
                  className="checkout-product"
                  key={item._id}
                >

                  <img
                    src={item.imageUrl}
                    alt={item.name}
                  />

                  <div className="checkout-product-info">

                    <h3>{item.name}</h3>

                    {isBuyNow ? (
                      <div className="checkout-quantity-control">
                        <button
                          type="button"
                          onClick={() => dispatch(decreaseBuyNowQuantity())}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span>Quantity: {item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => dispatch(increaseBuyNowQuantity())}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <p>Quantity: {item.quantity}</p>
                    )}

                    <span>
                      ₹
                      {(
                        Number(item.price) *
                        item.quantity
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              ))}

            </div>


            <hr />


            {/* Summary */}

            <div className="checkout-summary-row">

              <span>Items</span>

              <span>
                {checkoutItems.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>

            </div>


            <div className="checkout-summary-row">

              <span>Subtotal</span>

              <span>
                ₹{totalAmount.toFixed(2)}
              </span>

            </div>


            <div className="checkout-summary-row">

              <span>Shipping</span>

              <span>Free</span>

            </div>


            <hr />


            <div className="checkout-total">

              <span>Total</span>

              <span>
                ₹{totalAmount.toFixed(2)}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;