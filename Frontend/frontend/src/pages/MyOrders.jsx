import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/account.css';

const parseJsonResponse = async (response) => {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};

const formatAmount = (amount) => (
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
);

const MyOrders = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.token) {
      navigate('/login', { replace: true, state: { from: '/orders' } });
      return undefined;
    }

    const controller = new AbortController();

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await fetch('/api/orders/my-orders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          signal: controller.signal,
        });
        const data = await parseJsonResponse(response);

        if (response.status === 401) {
          logout();
          navigate('/login', { replace: true, state: { from: '/orders' } });
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || 'Unable to load your orders.');
        }

        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError(requestError.message || 'Unable to load your orders.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => controller.abort();
  }, [logout, navigate, user]);

  if (!user?.token) {
    return null;
  }

  return (
    <section className="account-page">
      <div className="account-container orders-container">
        <div className="orders-heading">
          <div>
            <p className="account-eyebrow">PURCHASE HISTORY</p>
            <h1>My Orders</h1>
          </div>
          <Link to="/profile" className="orders-profile-link">My Profile</Link>
        </div>

        {loading && <p className="orders-state">Loading your orders…</p>}

        {!loading && error && (
          <div className="orders-state orders-error">
            <p>{error}</p>
            <button type="button" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-state orders-empty">
            <h2>No Orders Yet</h2>
            <p>Your completed purchases will appear here.</p>
            <Link to="/" className="account-primary-action">Start Shopping</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => (
              <article className="order-card" key={order._id}>
                <header className="order-card-header">
                  <div>
                    <p>Order ID</p>
                    <h2>#{order._id}</h2>
                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}</span>
                  </div>
                  <span className={`order-status order-status-${order.status}`}>
                    {order.status}
                  </span>
                </header>

                <div className="order-products">
                  {(order.items || []).map((item) => {
                    const product = item.product || {};
                    return (
                      <div className="order-product" key={`${order._id}-${item._id || product._id}`}>
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name || 'Ordered product'} />
                        ) : (
                          <div className="order-product-placeholder">Product unavailable</div>
                        )}
                        <div>
                          <h3>{product.name || 'Product no longer available'}</h3>
                          <p>Quantity: {item.qty}</p>
                        </div>
                        <strong>{formatAmount(item.price * item.qty)}</strong>
                      </div>
                    );
                  })}
                </div>

                <footer className="order-card-footer">
                  <span>Payment ID: {order.paymentId || 'Not available'}</span>
                  <strong>Total: {formatAmount(order.totalAmount)}</strong>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyOrders;
