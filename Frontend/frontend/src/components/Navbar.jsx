import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthContext } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/" className="brand-link">
                    <span className="brand-icon">🛍️</span>
                    <span className="brand-name">ShopNest</span>
                    <span className="brand-dot">.</span>
                </Link>
            </div>

            <ul className="navbar-links">
                <li><Link to="/">Shop</Link></li>
                {user?.role !== 'admin' && (
                    <li>
                        <Link to="/cart" className="cart-link">
                            Cart ({cartItems.length})
                        </Link>
                    </li>
                )}
                {user ? (
                    <>
                        <li><Link to="/profile">Hi, {user.name}</Link></li>
                        {user.role !== 'admin' && <li><Link to="/orders">My Orders</Link></li>}
                        {user.role === 'admin' && <li><Link to="/admin">Admin</Link></li>}
                        <li><button onClick={handleLogout} className="btn-logout">Logout</button></li>
                    </>
                ) : (
                    <li><Link to="/login">Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
