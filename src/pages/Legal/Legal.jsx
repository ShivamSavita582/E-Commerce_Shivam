import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Legal.css";

const Legal = ({ defaultTab = "privacy" }) => {
  const location = useLocation();
  const isTerms = location.pathname.includes("terms") || defaultTab === "terms";

  return (
    <div className="legal-page">
      <div className="container">
        {/* Header */}
        <div className="legal-header">
          <span className="legal-badge">TRUST & COMPLIANCE</span>
          <h1>{isTerms ? "Terms of Service" : "Privacy Policy"}</h1>
          <p className="legal-sub">
            Last Updated: January 2026 • NEXUS TECH Legal & Security Compliance
          </p>
          <div className="legal-tab-switch">
            <Link
              to="/privacy"
              className={`legal-tab-btn ${!isTerms ? "active" : ""}`}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className={`legal-tab-btn ${isTerms ? "active" : ""}`}
            >
              Terms of Service
            </Link>
          </div>
        </div>

        {/* Content Box */}
        <div className="legal-card">
          {!isTerms ? (
            <div className="legal-content">
              <section>
                <h2>1. Information We Collect</h2>
                <p>
                  At NEXUS TECH, we prioritize customer trust and data integrity. We collect information you provide directly to us when creating an account, placing an order, or communicating with our customer experience team. This includes your name, email address, delivery shipping address, and phone number.
                </p>
              </section>

              <section>
                <h2>2. Secure Payment Processing</h2>
                <p>
                  We do not store your raw credit card numbers or UPI PINs on our servers. All financial transactions are encrypted through 256-bit SSL encryption and processed by RBI-authorized payment aggregators (including Razorpay, VISA, Mastercard, and RuPay).
                </p>
              </section>

              <section>
                <h2>3. How We Use Your Data</h2>
                <p>
                  Your information is utilized solely to fulfill orders, provide shipment tracking updates via email, prevent fraudulent transactions, and enhance your personalized tech catalog experience. We do not sell your personal data to third-party advertisers.
                </p>
              </section>

              <section>
                <h2>4. Cookies & Browser Storage</h2>
                <p>
                  We utilize lightweight browser local storage and essential session tokens to remember your shopping cart items, wishlist preferences, and authentication credentials securely.
                </p>
              </section>

              <section>
                <h2>5. Contact Our Data Protection Team</h2>
                <p>
                  If you have questions regarding data privacy or wish to request data deletion, contact us at{" "}
                  <a href="mailto:privacy@nexustech.io" className="text-primary fw-semibold">
                    privacy@nexustech.io
                  </a>
                  .
                </p>
              </section>
            </div>
          ) : (
            <div className="legal-content">
              <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or purchasing from NEXUS TECH, you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2>2. Official Manufacturer Warranty & Authenticity</h2>
                <p>
                  All flagship electronics, computing hardware, and accessories sold on NEXUS TECH are 100% genuine and sourced directly from verified brand manufacturers or authorized distributors. Each unit includes standard manufacturer warranty documentation.
                </p>
              </section>

              <section>
                <h2>3. Shipping, Delivery & Tracking</h2>
                <p>
                  Orders are dispatched within 24–48 hours of order confirmation. We partner with tier-1 logistics couriers across India. A live order tracking number is generated and linked directly inside your Order History dashboard upon dispatch.
                </p>
              </section>

              <section>
                <h2>4. 30-Day Hassle-Free Returns & Replacements</h2>
                <p>
                  In the rare event that an item arrives with physical damage or a factory defect, you are eligible for a full replacement or refund within 30 days of delivery. The item must be returned with all original accessories and packaging.
                </p>
              </section>

              <section>
                <h2>5. Customer Support & Dispute Resolution</h2>
                <p>
                  For billing queries or order escalations, reach our round-the-clock support desk at{" "}
                  <a href="mailto:support@nexustech.io" className="text-primary fw-semibold">
                    support@nexustech.io
                  </a>{" "}
                  or visit our <Link to="/contact" className="text-primary fw-semibold">Help Center</Link>.
                </p>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Legal;
