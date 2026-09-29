import React, { useState } from "react";
import { Link } from "react-router-dom";
import { notify } from "../../utils/notification";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      notify.warning("Please enter a valid email address.");
      return;
    }
    setSubscribed(true);
    notify.success("Welcome to the Nexus VIP List! Check your inbox for your 10% coupon.");
    setEmail("");
  };

  const categories = [
    { label: "All Flagship Hardware", to: "/shop" },
    { label: "Laptops & MacBooks", to: "/shop?category=laptop" },
    { label: "Flagship Smartphones", to: "/shop?category=mobile" },
    { label: "Mirrorless & Cinema Cameras", to: "/shop?category=camera" },
    { label: "ANC Headphones & Audio", to: "/shop?category=accessories" },
    { label: "Custom Keyboards", to: "/shop?category=accessories" },
  ];

  const customerCare = [
    { label: "Live Order Tracking", to: "/orders" },
    { label: "7-Day Doorstep Returns", to: "/about" },
    { label: "Insured Express Shipping", to: "/about" },
    { label: "Official Warranty Claims", to: "/about" },
    { label: "My Customer Account", to: "/profile" },
    { label: "Shopping Cart", to: "/cart" },
  ];

  const companyLinks = [
    { label: "About Nexus Tech", to: "/about" },
    { label: "Contact Customer Support", to: "/contact" },
    { label: "Warranty & Protection", to: "/about" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms of Service", to: "/terms" },
  ];

  return (
    <footer className="nexus-footer">
      {/* 1. VIP NEWSLETTER TEASER CARD */}
      <div className="footer-newsletter-wrap">
        <div className="newsletter-card">
          <div className="newsletter-copy">
            <span className="newsletter-pill">✦ EXCLUSIVE HARDWARE ACCESS</span>
            <h2>Stay Ahead of the Tech Curve.</h2>
            <p>
              Subscribe to the Nexus VIP dispatch for early access to flagship drops, secret promo codes, and private sales.
            </p>
          </div>

          <form className="newsletter-input-group" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={subscribed}
            />
            <button type="submit" className="newsletter-btn" disabled={subscribed}>
              {subscribed ? "✓ Subscribed!" : "Join VIP List"}
            </button>
          </form>
        </div>
      </div>

      {/* 2. MAIN 5-COLUMN FOOTER */}
      <div className="footer-main-container">
        <div className="footer-grid">
          {/* Column 1: Brand Story */}
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand-logo">
              <div className="brand-logo-mark">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div className="brand-title-wrap">
                <span className="brand-main-name">NEXUS</span>
                <span className="brand-sub-name">TECH</span>
              </div>
            </Link>

            <p className="footer-bio">
              India's premier marketplace for flagship computing, imaging, and audio hardware. Certified authentic devices backed by direct manufacturer warranties and nationwide fulfillment.
            </p>

            {/* Trust Badges */}
            <div className="footer-trust-pill">
              <span className="material-symbols-outlined">verified</span>
              <span>100% Authorized Brand Dealer</span>
            </div>

            {/* Social Links */}
            <div className="footer-social-row">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                𝕏
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                GitHub
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                YouTube
              </a>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="footer-nav-col">
            <h4 className="col-title">Flagship Catalog</h4>
            <ul className="footer-links-list">
              {categories.map((c) => (
                <li key={c.label}>
                  <Link to={c.to}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="footer-nav-col">
            <h4 className="col-title">Customer Experience</h4>
            <ul className="footer-links-list">
              {customerCare.map((c) => (
                <li key={c.label}>
                  <Link to={c.to}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="footer-nav-col">
            <h4 className="col-title">Nexus Store</h4>
            <ul className="footer-links-list">
              {companyLinks.map((c) => (
                <li key={c.label}>
                  <Link to={c.to}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact & Payments */}
          <div className="footer-contact-col">
            <h4 className="col-title">Direct Helpdesk</h4>
            <div className="footer-contact-item">
              <span className="material-symbols-outlined">support_agent</span>
              <div>
                <strong>Mon - Sat: 9:00 AM - 8:00 PM</strong>
                <p>Dedicated Customer Support</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="material-symbols-outlined">mail</span>
              <div>
                <strong>support@nexustech.com</strong>
                <p>Instant ticket resolution</p>
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="material-symbols-outlined">lock</span>
              <div>
                <strong>Razorpay 256-Bit SSL</strong>
                <p>UPI, Credit/Debit, NetBanking</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. FOOTER BOTTOM BAR */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-container">
          <p className="copyright-text">
            © {year} NEXUS TECH INDIA PVT. LTD. All rights reserved.
          </p>

          <div className="bottom-links">
            <span className="system-status-indicator">
              <span className="status-dot"></span>
              All Systems Operational
            </span>
            <span className="bar-sep">•</span>
            <Link to="/privacy">Privacy & Cookies</Link>
            <span className="bar-sep">•</span>
            <Link to="/terms">Legal Notice & Terms</Link>
            <span className="bar-sep">•</span>
            <Link to="/contact">Grievance Officer</Link>
          </div>

          <div className="payment-badges-row">
            <span className="pay-chip">UPI</span>
            <span className="pay-chip">VISA</span>
            <span className="pay-chip">Mastercard</span>
            <span className="pay-chip">RuPay</span>
            <span className="pay-chip">Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
