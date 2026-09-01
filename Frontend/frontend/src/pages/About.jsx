import React from 'react';

const About = () => {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <p className="about-label">ABOUT SHOPNEST</p>

        <h1>
          Your Trusted
          <span> Online Shopping </span>
          Destination
        </h1>

        <p className="about-subtitle">
          ShopNest is a modern e-commerce platform designed to make
          online shopping simple, convenient, and enjoyable.
        </p>
      </section>

      {/* About Content */}
      <section className="about-content">

        <div className="about-card">
          <h2>Who We Are</h2>

          <p>
            ShopNest is an online shopping platform where customers can
            discover quality products across different categories.
            Our goal is to provide a smooth and user-friendly shopping
            experience from browsing products to placing an order.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Mission</h2>

          <p>
            Our mission is to make online shopping accessible, reliable,
            and enjoyable. We focus on providing a clean interface,
            useful product information, secure transactions, and a
            convenient shopping experience.
          </p>
        </div>

      </section>

      {/* Features */}
      <section className="about-features">

        <h2>Why Choose ShopNest?</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">🛍️</div>
            <h3>Wide Selection</h3>
            <p>
              Discover products from different categories in one place.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure Shopping</h3>
            <p>
              We focus on providing a safe and reliable shopping
              experience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Easy Experience</h3>
            <p>
              Browse products and find what you need with a simple,
              intuitive interface.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">❤️</div>
            <h3>Customer Focused</h3>
            <p>
              We aim to make every shopping experience convenient and
              enjoyable.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default About;
