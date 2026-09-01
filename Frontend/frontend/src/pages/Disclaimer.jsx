import React from 'react';

const Disclaimer = () => {
  return (
    <div className="disclaimer-page">

      {/* Header */}
      <section className="disclaimer-hero">
        <p className="disclaimer-label">SHOPNEST</p>

        <h1>Disclaimer</h1>

        <p>
          Important information about using the ShopNest platform.
        </p>
      </section>

      {/* Content */}
      <section className="disclaimer-content">

        <div className="disclaimer-card">
          <h2>General Information</h2>

          <p>
            The information provided on ShopNest is for general
            informational and e-commerce purposes only. While we make
            reasonable efforts to keep product information accurate and
            up to date, we do not guarantee that all information is
            complete, accurate, or current at all times.
          </p>
        </div>

        <div className="disclaimer-card">
          <h2>Product Information</h2>

          <p>
            Product names, descriptions, prices, images, availability,
            ratings, and other details may change without prior notice.
            Product images are provided for illustrative purposes and
            may differ slightly from the actual product.
          </p>
        </div>

        <div className="disclaimer-card">
          <h2>Pricing & Availability</h2>

          <p>
            Prices and product availability displayed on ShopNest may
            change at any time. We reserve the right to correct pricing
            errors, update product information, or modify availability
            without prior notice.
          </p>
        </div>

        <div className="disclaimer-card">
          <h2>External Services</h2>

          <p>
            ShopNest may use third-party services for payments, hosting,
            image storage, analytics, or other functionality. We are
            not responsible for interruptions, errors, or changes
            caused by third-party services.
          </p>
        </div>

        <div className="disclaimer-card">
          <h2>Limitation of Liability</h2>

          <p>
            ShopNest is not responsible for any direct, indirect,
            incidental, or consequential loss resulting from the use
            of the platform or reliance on information provided through
            it, to the extent permitted by applicable law.
          </p>
        </div>

        <div className="disclaimer-card">
          <h2>Changes to This Disclaimer</h2>

          <p>
            We may update this Disclaimer from time to time to reflect
            changes to our services or policies. Any updated version
            will be made available on this page.
          </p>
        </div>

        <div className="disclaimer-note">
          <strong>Note:</strong>
          <span>
            ShopNest is a project-based e-commerce platform. Product
            information and services may be provided for demonstration
            and educational purposes.
          </span>
        </div>

      </section>

    </div>
  );
};

export default Disclaimer;

