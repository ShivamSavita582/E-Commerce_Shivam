import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { contactService } from "../../services/contactService";
import { notify } from "../../utils/notification";
import "./Contact.css";

const Contact = () => {
  const { user, isAuthenticated } = useContext(AppContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Product Question",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      notify.error("Please enter your name.");
      return;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      notify.error("Please provide a valid email address.");
      return;
    }

    if (!formData.subject.trim()) {
      notify.error("Please select a subject.");
      return;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      notify.error("Please write a detailed message (minimum 10 characters).");
      return;
    }

    try {
      setSubmitting(true);
      const res = await contactService.submitQuery({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });

      if (res.success) {
        setSubmittedTicket(res.contact || { ticketId: res.ticketId });
        notify.success("Inquiry sent! Our tech team will email you within 24 hours.");
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          subject: "Product Question",
          message: "",
        });
      } else {
        notify.error(res.message || "Failed to submit inquiry.");
      }
    } catch (error) {
      console.error("Contact submission error:", error);
      const errMsg =
        error?.response?.data?.message ||
        "Could not send your message. Please verify your details or try again.";
      notify.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedTicket(null);
  };

  return (
    <main className="contact-page">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="contact-eyebrow">
            ✦ DEDICATED CONCIERGE & SUPPORT
          </span>

          <h1>
            We’re here to
            <span> help you.</span>
          </h1>

          <p>
            Have a question about a flagship workstation, order shipment, or custom configuration? Our hardware specialists are on standby to assist you.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT CONTENT
      ===================================================== */}
      <section className="contact-container">
        {/* =================================================
            CONTACT INFORMATION (LEFT)
        ================================================= */}
        <div className="contact-info">
          <div className="contact-section-heading">
            <span className="section-eyebrow">DIRECT REACH</span>
            <h2>Let's start a conversation.</h2>
            <p>
              Whether you need pre-purchase technical consultation or order assistance, we ensure priority response times for every inquiry.
            </p>
          </div>

          {/* Email */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <span>EMAIL CONCIERGE</span>
              <h3>support@nexustech.io</h3>
              <p>Guaranteed response within 24 business hours.</p>
            </div>
          </div>

          {/* Phone */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <span className="material-symbols-outlined">call</span>
            </div>
            <div>
              <span>DIRECT PHONE LINE</span>
              <h3>+91 (800) 890-TECH</h3>
              <p>Mon – Sat, 9:00 AM – 8:00 PM IST</p>
            </div>
          </div>

          {/* Location */}
          <div className="contact-info-card">
            <div className="contact-info-icon">
              <span className="material-symbols-outlined">location_on</span>
            </div>
            <div>
              <span>FULFILLMENT HEADQUARTERS</span>
              <h3>Nexus Tech Hub, Bengaluru</h3>
              <p>Karnataka 560103, India</p>
            </div>
          </div>

          {/* Trust */}
          <div className="contact-trust">
            <div className="trust-icon">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <div>
              <strong>100% Brand Certified Support</strong>
              <p>
                Our team directly interfaces with official Apple Care, Sony Pro, Dell, and Samsung technical desks.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            CONTACT FORM (RIGHT)
        ================================================= */}
        <div className="contact-form-card">
          {submittedTicket ? (
            /* SUCCESS TICKET RECEIPT STATE */
            <div className="contact-success-state">
              <div className="success-icon-wrap">
                <span className="material-symbols-outlined">check_circle</span>
              </div>

              <h2>Inquiry Registered!</h2>
              <p className="success-lead">
                Thank you for reaching out. Your support request has been logged into our customer service queue.
              </p>

              <div className="ticket-id-badge">
                <small>REFERENCE TICKET ID</small>
                <strong>#{submittedTicket.ticketId || "NX-RECEIVED"}</strong>
              </div>

              <div className="ticket-summary-box">
                <div className="ticket-field">
                  <span>Customer Name:</span>
                  <strong>{submittedTicket.name}</strong>
                </div>
                <div className="ticket-field">
                  <span>Registered Email:</span>
                  <strong>{submittedTicket.email}</strong>
                </div>
                <div className="ticket-field">
                  <span>Inquiry Subject:</span>
                  <strong>{submittedTicket.subject}</strong>
                </div>
                <div className="ticket-field">
                  <span>Logged At:</span>
                  <strong>
                    {new Date(submittedTicket.createdAt || Date.now()).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </strong>
                </div>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="btn-submit-another"
                  onClick={handleResetForm}
                >
                  <span className="material-symbols-outlined">add_comment</span>
                  <span>Submit Another Query</span>
                </button>
                <Link to="/shop" className="btn-continue-shopping">
                  <span>Continue Shopping</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          ) : (
            /* ACTIVE FORM STATE */
            <>
              <div className="form-heading">
                <span className="section-eyebrow">SEND AN INQUIRY</span>
                <h2>How can we help you?</h2>
                <p>
                  Fill out your details below and our hardware team will record your query and follow up swiftly.
                </p>

                {isAuthenticated && (
                  <div className="auth-prefill-badge">
                    <span className="material-symbols-outlined auth-check">account_circle</span>
                    <span>
                      Logged in as <strong>{user?.name}</strong> ({user?.email})
                    </span>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                {/* Name + Email */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Your Full Name <span className="req-star">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="req-star">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                {/* Phone + Subject */}
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">
                      Contact Phone <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      Inquiry Category <span className="req-star">*</span>
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="Product Question">Product Specification & Advice</option>
                      <option value="Order Support">Order Tracking & Dispatch Status</option>
                      <option value="Custom Workstation Config">Custom Workstation / Bulk Setup</option>
                      <option value="Return & Refund">7-Day Replacement / Warranty Claim</option>
                      <option value="Payment Issue">Payment, Razorpay or EMI Assistance</option>
                      <option value="Corporate GST Invoicing">Corporate GST Invoicing Inquiry</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label htmlFor="message">
                    Your Message / Detailed Specifications <span className="req-star">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Describe your question or requirements in detail (minimum 10 characters)..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="contact-submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status" />
                      <span>Recording Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>

                <p className="form-note">
                  🔒 We respect your privacy. Inquiries are stored in our secure database and handled strictly by certified support agents.
                </p>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Contact;
