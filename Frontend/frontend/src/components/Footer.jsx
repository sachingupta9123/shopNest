import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h3>ShopNest</h3>
          <p>Premium E-commerce Platform.</p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/returns">Return Policy</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>

        {/* Copyright */}
        <div className="footer-copyright">
          &copy; {new Date().getFullYear()} ShopNest. All rights reserved.
        </div>

      </div>

    </footer>
  );
};

export default Footer;