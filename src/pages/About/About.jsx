import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./About.css";

// Assets
import heroShowcaseImg from "../../assets/Image/hero_showcase.jpg";
import laptopImg from "../../assets/Image/laptop.webp";

const About = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const pillars = [
    {
      icon: "verified",
      title: "100% Factory Sealed",
      description:
        "Zero refurbished or grey-market units. Every MacBook, smartphone, and cinema camera arrives in pristine, factory-sealed condition with verifiable manufacturer serials.",
      badge: "ORIGINAL WARRANTY",
    },
    {
      icon: "local_shipping",
      title: "Insured 48-Hour Logistics",
      description:
        "Every consignment is insured against transit theft or damage, sealed with tamper-evident tape, and delivered with live OTP confirmation across 20,000+ pin codes.",
      badge: "TRANSIT SECURED",
    },
    {
      icon: "published_with_changes",
      title: "7-Day Doorstep Replacement",
      description:
        "If your hardware encounters any manufacturing defect or transit fault, our courier picks it up directly from your doorstep with an instant brand-new replacement.",
      badge: "ZERO HASSLE",
    },
    {
      icon: "support_agent",
      title: "Certified Tech Concierge",
      description:
        "Speak directly with knowledgeable hardware engineers who understand CUDA cores, ProRes bitrates, sensor sizes, and workstation thermal profiles.",
      badge: "PRO SPECIALISTS",
    },
  ];

  const brandPartners = [
    { name: "Apple", note: "Authorized Hardware Dealer" },
    { name: "Sony", note: "Alpha Imaging Partner" },
    { name: "Dell", note: "ProSupport Computing" },
    { name: "Samsung", note: "Flagship Galaxy Partner" },
    { name: "Asus ROG", note: "Extreme Gaming & Creator Rigs" },
    { name: "Bose", note: "Acoustic Noise Cancelling" },
  ];

  const qualitySteps = [
    {
      step: "01",
      title: "Direct Brand Inward",
      desc: "All inventory is sourced exclusively from official brand distribution channels — strictly no third-party liquidations.",
    },
    {
      step: "02",
      title: "Serial & Warranty Registry",
      desc: "Manufacturer serial numbers and IMEIs are logged and validated with brand databases before placement into stock.",
    },
    {
      step: "03",
      title: "Climate-Controlled Storage",
      desc: "Sensors, OLED displays, and battery chemistry are stored in temperature- and humidity-regulated buffer facilities.",
    },
    {
      step: "04",
      title: "Reinforced Impact Packaging",
      desc: "High-value glass and magnesium bodies are cocooned in multi-layer shock-absorption air-cushions.",
    },
  ];

  const faqs = [
    {
      q: "How does Nexus Tech guarantee authentic products?",
      a: "We only procure directly from tier-1 authorized distributors of Apple India, Sony India, Dell, and Samsung. Every unit arrives with its original manufacturer seal, genuine tax invoice, and active standard brand warranty.",
    },
    {
      q: "Can businesses claim GST Input Tax Credit on purchases?",
      a: "Yes. During checkout, provide your company's registered GSTIN and billing address. A compliant GST tax invoice with appropriate HSN codes will be generated and provided upon dispatch.",
    },
    {
      q: "Where do I claim warranty for devices purchased here?",
      a: "Because all items are genuine Indian retail units, warranty can be claimed at any authorized service center of the respective brand (e.g. Apple Authorized Service Providers, Sony Service Centers) across the country.",
    },
  ];

  return (
    <main className="nexus-about-root">
      {/* ========================================================
          1. HERO SECTION: BRAND VISION & VALUES
      ======================================================== */}
      <section className="about-hero-section">
        <div className="about-hero-glow glow-top" />
        <div className="about-hero-glow glow-bottom" />

        <div className="about-hero-container">
          <div className="about-hero-badge">
            <span className="badge-pulse" />
            <span>THE NEXUS STORY & PHILOSOPHY</span>
          </div>

          <h1 className="about-hero-title">
            Curated For The Obsessive.
            <br />
            <span className="text-gradient-purple">Engineered For Tomorrow.</span>
          </h1>

          <p className="about-hero-subtitle">
            Nexus Tech was created on an uncompromising premise: professionals and creators shouldn't have to navigate grey markets, ambiguous warranties, or slow logistics to get elite computing and imaging hardware.
          </p>

          <div className="about-hero-actions">
            <Link to="/shop" className="btn-about-primary">
              <span>Explore The Catalog</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/contact" className="btn-about-secondary">
              <span>Talk to Tech Concierge</span>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="about-stats-strip">
            <div className="about-stat-item">
              <strong>50,000+</strong>
              <small>Flagships Delivered</small>
            </div>
            <div className="about-stat-sep" />
            <div className="about-stat-item">
              <strong>100%</strong>
              <small>Brand Sealed Guarantee</small>
            </div>
            <div className="about-stat-sep" />
            <div className="about-stat-item">
              <strong>4.9 ★</strong>
              <small>Customer Satisfaction</small>
            </div>
            <div className="about-stat-sep" />
            <div className="about-stat-item">
              <strong>20,000+</strong>
              <small>Pin Codes Covered</small>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. THE NEXUS STANDARD (FOUR PILLARS)
      ======================================================== */}
      <section className="about-section about-pillars-section">
        <div className="about-section-header text-center">
          <span className="section-pre-title">UNCOMPROMISING PRINCIPLES</span>
          <h2 className="section-title">
            The Nexus <span>Standard.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            How we protect your investment from the factory floor to your workstation desk.
          </p>
        </div>

        <div className="about-pillars-grid">
          {pillars.map((item) => (
            <div className="about-pillar-card" key={item.title}>
              <div className="pillar-icon-box">
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="pillar-badge">{item.badge}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          3. VISUAL STORY / PHILOSOPHY SPOTLIGHT
      ======================================================== */}
      <section className="about-section about-story-spotlight">
        <div className="story-split-container">
          <div className="story-image-wrap">
            <img
              src={heroShowcaseImg}
              alt="Flagship hardware craftsmanship"
              className="story-main-img"
            />
            <div className="story-floating-card">
              <span className="material-symbols-outlined star-ic">workspace_premium</span>
              <div>
                <strong>Zero Grey Market Policy</strong>
                <small>100% Authentic Indian Stock</small>
              </div>
            </div>
          </div>

          <div className="story-text-wrap">
            <span className="section-pre-title">FOUNDER'S CREED</span>
            <h2 className="section-title">
              Why We Refuse <span>To Cut Corners.</span>
            </h2>
            <p className="story-p">
              When an engineer compiles production code on an Apple M3 Max, or a cinematographer records a multi-day commercial on a Sony FX cinema sensor, equipment reliability isn't a luxury — it is their livelihood.
            </p>
            <p className="story-p">
              We eliminated the layers of unvetted third-party sellers. Every unit in our fulfillment hub is sourced directly through brand-authorized channels, verified against serial registers, and packed inside climate-controlled cleanrooms.
            </p>

            <div className="story-checklist">
              <div className="story-check-item">
                <span className="material-symbols-outlined check-mark">check_circle</span>
                <div>
                  <strong>Official Indian Warranties</strong>
                  <p>Full pan-India brand coverage with zero warranty claim rejections.</p>
                </div>
              </div>
              <div className="story-check-item">
                <span className="material-symbols-outlined check-mark">check_circle</span>
                <div>
                  <strong>Enterprise GST Invoicing</strong>
                  <p>Full 18% Input Tax Credit deduction for corporate accounts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. THE 4-STEP FULFILLMENT MATRIX
      ======================================================== */}
      <section className="about-section about-quality-section">
        <div className="about-section-header text-center">
          <span className="section-pre-title">FULFILLMENT PIPELINE</span>
          <h2 className="section-title text-white">
            The Quality <span>Matrix.</span>
          </h2>
          <p className="section-subtitle text-slate-300 mx-auto">
            From the factory container to your hands — four layers of precision verification.
          </p>
        </div>

        <div className="quality-steps-grid">
          {qualitySteps.map((q) => (
            <div className="quality-step-card" key={q.step}>
              <span className="step-num">{q.step}</span>
              <h3>{q.title}</h3>
              <p>{q.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. AUTHORIZED BRAND ECOSYSTEM
      ======================================================== */}
      <section className="about-section about-ecosystem-section">
        <div className="about-section-header text-center">
          <span className="section-pre-title">AUTHORIZED RELATIONS</span>
          <h2 className="section-title">
            Our Brand <span>Ecosystem.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Direct affiliations with the world's most demanding hardware manufacturers.
          </p>
        </div>

        <div className="brand-partners-grid">
          {brandPartners.map((bp) => (
            <div className="brand-partner-card" key={bp.name}>
              <span className="bp-bullet">✦</span>
              <h3>{bp.name}</h3>
              <p>{bp.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. FAQ ACCORDION
      ======================================================== */}
      <section className="about-section about-faq-section">
        <div className="about-faq-container">
          <div className="faq-intro">
            <span className="section-pre-title">CUSTOMER CLARITY</span>
            <h2 className="section-title">
              Common <span>Questions.</span>
            </h2>
            <p className="section-subtitle">
              Learn how our sourcing, warranties, and corporate services operate.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((f, i) => (
              <div
                key={i}
                className={`about-faq-card ${openFaq === i ? "open" : ""}`}
              >
                <button
                  className="about-faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{f.q}</span>
                  <span className="material-symbols-outlined">
                    {openFaq === i ? "remove" : "add"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="about-faq-body">
                    <p>{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FINAL CTA
      ======================================================== */}
      <section className="about-section about-cta-section">
        <div className="about-cta-card">
          <h2>
            Experience Hardware As It <span>Was Intended.</span>
          </h2>
          <p>
            Discover our curated flagship inventory or connect directly with our hardware specialists for custom workstation builds.
          </p>
          <div className="about-cta-btns">
            <Link to="/shop" className="btn-about-cta-main">
              <span>Explore Flagships</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <Link to="/contact" className="btn-about-cta-ghost">
              <span>Contact Support</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
