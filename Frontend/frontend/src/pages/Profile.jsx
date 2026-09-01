import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/account.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate('/login', { replace: true, state: { from: '/profile' } });
    }
  }, [navigate, user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user?.token) {
    return null;
  }

  return (
    <section className="account-page">
      <div className="account-container">
        <p className="account-eyebrow">MY ACCOUNT</p>
        <h1>Profile</h1>

        <div className="profile-card">
          <div className="profile-avatar" aria-hidden="true">
            {user.name?.trim().charAt(0).toUpperCase() || 'U'}
          </div>

          <div className="profile-details">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span>ShopNest account</span>
          </div>
        </div>

        <div className="account-actions">
          <Link to="/orders" className="account-primary-action">
            My Orders
          </Link>
          <button type="button" className="account-secondary-action" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
