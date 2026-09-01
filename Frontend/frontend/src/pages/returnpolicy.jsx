import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="return-policy-page">

      {/* Hero Section */}
      <section className="return-hero">
        <p className="return-label">SHOPNEST</p>

        <h1>Return Policy</h1>

        <p>
          Simple and transparent information about returns and refunds.
        </p>
      </section>

      {/* Policy Content */}
      <section className="return-content">

        <div className="return-card">
          <h2>Our Return Policy</h2>

          <p>
            At ShopNest, we want you to have a satisfactory shopping
            experience. If you receive a product that is damaged,
            defective, or significantly different from the product
            description, you may be eligible to request a return.
          </p>
        </div>

        <div className="return-card">
          <h2>Eligibility for Returns</h2>

          <p>
            To be eligible for a return, the product should generally
            be unused and in its original condition. The product should
            also be returned with its original packaging and accessories,
            where applicable.
          </p>

          <ul>
            <li>Product must be unused or in acceptable condition.</li>
            <li>Original packaging should be retained when possible.</li>
            <li>Proof of purchase may be required.</li>
            <li>Return requests should be submitted within the applicable return period.</li>
          </ul>
        </div>

        <div className="return-card">
          <h2>Non-Returnable Items</h2>

          <p>
            Certain products may not be eligible for return due to their
            nature, condition, hygiene requirements, or other applicable
            restrictions.
          </p>

          <ul>
            <li>Products damaged after delivery due to misuse.</li>
            <li>Products that have been altered or modified.</li>
            <li>Items specifically marked as non-returnable.</li>
            <li>Products returned without required accessories or packaging.</li>
          </ul>
        </div>

        <div className="return-card">
          <h2>How to Request a Return</h2>

          <div className="return-steps">

            <div className="return-step">
              <span>01</span>
              <div>
                <h3>Contact Us</h3>
                <p>
                  Contact ShopNest with your order details and the
                  reason for the return.
                </p>
              </div>
            </div>

            <div className="return-step">
              <span>02</span>
              <div>
                <h3>Return Approval</h3>
                <p>
                  Our team will review the request and provide
                  return instructions when applicable.
                </p>
              </div>
            </div>

            <div className="return-step">
              <span>03</span>
              <div>
                <h3>Send the Product</h3>
                <p>
                  Pack the product securely and return it according
                  to the provided instructions.
                </p>
              </div>
            </div>

            <div className="return-step">
              <span>04</span>
              <div>
                <h3>Refund or Replacement</h3>
                <p>
                  Once the returned product is reviewed, an eligible
                  refund or replacement may be processed.
                </p>
              </div>
            </div>

          </div>
        </div>

        <div className="return-card">
          <h2>Refunds</h2>

          <p>
            If your return is approved, the applicable refund will
            generally be processed through the original payment method.
            The time required for the refund to appear may depend on
            your payment provider or bank.
          </p>
        </div>

        <div className="return-card">
          <h2>Damaged or Incorrect Products</h2>

          <p>
            If you receive a damaged, defective, or incorrect product,
            please contact ShopNest as soon as possible with your order
            details and relevant information. We will review the issue
            and determine the appropriate resolution.
          </p>
        </div>

        <div className="return-card">
          <h2>Changes to This Policy</h2>

          <p>
            ShopNest may update this Return Policy from time to time.
            Any changes will be reflected on this page. Customers are
            encouraged to review the policy before making a return
            request.
          </p>
        </div>

        <div className="return-note">
          <strong>Important:</strong>
          <span>
            This Return Policy is intended for the ShopNest project.
            Actual return periods, eligibility requirements, and refund
            procedures may vary depending on the applicable products,
            sellers, payment providers, and laws.
          </span>
        </div>

      </section>

    </div>
  );
};

export default ReturnPolicy;
