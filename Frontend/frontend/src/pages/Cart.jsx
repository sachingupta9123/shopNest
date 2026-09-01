import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
} from '../redux/cartSlice';

import '../styles/cart.css';

const Cart = () => {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.cartItems
  );

  const total = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">

        <div className="empty-cart">

          <h1>Your Cart is Empty</h1>

          <p>
            You haven't added any products yet.
          </p>

          <Link
            to="/"
            className="shop-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* Header */}

        <div className="cart-header">

          <h1>Shopping Cart</h1>

          <button
            className="clear-cart-btn"
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>

        </div>

        <div className="cart-content">

          {/* Cart Items */}

          <div className="cart-items">

            {cartItems.map((item) => (

              <div
                className="cart-item"
                key={item._id}
              >

                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />

                <div className="cart-item-info">

                  <h2>{item.name}</h2>

                  <p className="cart-category">
                    {item.category}
                  </p>

                  <p className="cart-price">
                    ₹{Number(item.price).toFixed(2)}
                  </p>

                  {/* Quantity */}

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        dispatch(
                          decreaseQuantity(item._id)
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          increaseQuantity(item._id)
                        )
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="cart-item-right">

                  <p className="item-total">
                    ₹
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>

                  <button
                    className="remove-btn"
                    onClick={() =>
                      dispatch(
                        removeFromCart(item._id)
                      )
                    }
                  >
                    Remove
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* Order Summary */}

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">

              <span>Items</span>

              <span>
                {cartItems.reduce(
                  (sum, item) =>
                    sum + item.quantity,
                  0
                )}
              </span>

            </div>

            <div className="summary-row">

              <span>Subtotal</span>

              <span>
                ₹{total.toFixed(2)}
              </span>

            </div>

            <div className="summary-row">

              <span>Shipping</span>

              <span>Free</span>

            </div>

            <hr />

            <div className="summary-total">

              <span>Total</span>

              <span>
                ₹{total.toFixed(2)}
              </span>

            </div>

            <Link to="/checkout"className="checkout-btn">Proceed to Checkout</Link>

            <Link to="/" className="continue-shopping">Continue Shopping</Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Cart;