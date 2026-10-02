import React, { useContext, useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { SingleProductCard } from "../../components/product/ProductCard";
import { notify } from "../../utils/notification";
import { formatPrice } from "../../utils/formatCurrency";
import "./Home.css";

// Assets
import heroShowcaseImage from "../../assets/Image/hero_showcase.jpg";
import heroBgImage from "../../assets/Image/bg.png";
import laptopImage from "../../assets/Image/laptop.webp";
import mobileImage from "../../assets/Image/mobile.webp";
import cameraImage from "../../assets/Image/camera.webp";
import headphonesImage from "../../assets/Image/headphones.jpg";

const Home = () => {
  const { products } = useContext(AppContext);

  // Hero interactive showcase state
  const [activeHeroTab, setActiveHeroTab] = useState(0);

  // Category filter state for product catalog
  const [activeCatalogTab, setActiveCatalogTab] = useState("all");

  // Copy coupon code state
  const [copiedCode, setCopiedCode] = useState(false);

  // FAQ Accordion open index
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Flash Sale Countdown Timer (Hours, Minutes, Seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hero Showcase Slides
  const heroSlides = [
    {
      id: "all",
      label: "Flagship Ecosystem",
      tag: "THE 2026 TRIPLE CROWN",
      title: "Architected for Speed. Built for Tomorrow.",
      description:
        "The ultimate catalog of elite Apple silicon, Snapdragon AI titanium flagships, and full-frame cinema optics — curated for uncompromising creators.",
      image: heroShowcaseImage,
      badgeText: "Flagship Trio 2026",
      specs: ["M3 Max 16-Core", "Snapdragon 8 Gen 3", "33MP Full-Frame"],
      priceFrom: "₹69,999",
      targetCategory: "/shop",
    },
    {
      id: "laptops",
      label: "MacBook & Workstations",
      tag: "EXTREME COMPUTATIONAL SILICON",
      title: "MacBook Pro M3 Max & OLED Rigs",
      description:
        "Tear through 8K ProRes timelines, complex codebases, and massive 3D renders with up to 128GB unified memory and 22-hour battery life.",
      image: laptopImage,
      badgeText: "Apple M3 Max Series",
      specs: ["16-Core CPU", "40-Core GPU", "1600 Nits Liquid Retina XDR"],
      priceFrom: "₹1,84,990",
      targetCategory: "/shop?category=laptop",
    },
    {
      id: "mobiles",
      label: "Titanium Smartphones",
      tag: "NEXT-GEN COMPUTATIONAL OPTICS",
      title: "Galaxy S24 Ultra & iPhone 16 Pro",
      description:
        "Grade 5 aerospace titanium, real-time generative AI translation, and periscope optical zoom capturing studio detail in every frame.",
      image: mobileImage,
      badgeText: "Titanium Flagships",
      specs: ["200MP Quad Tele", "Snapdragon 8 Gen 3", "120Hz Dynamic LTPO"],
      priceFrom: "₹89,999",
      targetCategory: "/shop?category=mobile",
    },
    {
      id: "cameras",
      label: "Cinema & Mirrorless",
      tag: "OPTICAL PRECISION FOR STORYTELLERS",
      title: "Sony Alpha 7 IV & Cinema Rigs",
      description:
        "Full-frame 33MP Exmor R sensors, BIONZ XR processing, 10-bit 4:2:2 video, and revolutionary AI autofocus locking onto eyes in real-time.",
      image: cameraImage,
      badgeText: "Cinema Grade Optics",
      specs: ["33MP Full Frame", "Real-Time Eye AF", "4K 60p 10-Bit"],
      priceFrom: "₹2,14,990",
      targetCategory: "/shop?category=camera",
    },
  ];

  const currentHero = heroSlides[activeHeroTab] || heroSlides[0];

  // Copy Coupon handler
  const handleCopyCoupon = (code = "SAVE10") => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    notify.success(`Coupon code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Filtered products for catalog tabs
  const catalogProducts = useMemo(() => {
    const all = products || [];
    if (activeCatalogTab === "all") {
      return all.slice(0, 8);
    }
    if (activeCatalogTab === "laptop") {
      return all.filter((p) => p.category?.toLowerCase() === "laptop").slice(0, 8);
    }
    if (activeCatalogTab === "mobile") {
      return all.filter((p) => p.category?.toLowerCase() === "mobile").slice(0, 8);
    }
    if (activeCatalogTab === "camera") {
      return all.filter((p) => p.category?.toLowerCase() === "camera").slice(0, 8);
    }
    if (activeCatalogTab === "bestseller") {
      const best = all.filter((p) => p.isBestSeller);
      return (best.length > 0 ? best : all).slice(0, 8);
    }
    return all.slice(0, 8);
  }, [products, activeCatalogTab]);

  // Featured Categories Data
  const categories = [
    {
      number: "01",
      title: "Laptops & Workstations",
      subtitle: "CREATIVE & DEV WORKFLOWS",
      description: "Apple M3 Max & Intel Core Ultra laptops engineered for limitless speed.",
      specs: ["M3 Max / Intel i9", "120Hz Liquid Retina", "Up to 24h Battery"],
      image: laptopImage,
      link: "/shop?category=laptop",
      accentGlow: "rgba(99, 102, 241, 0.25)",
    },
    {
      number: "02",
      title: "Flagship Smartphones",
      subtitle: "TITANIUM & AI PERFORMANCE",
      description: "Next-gen titanium handsets with 200MP periscope zoom and on-device AI.",
      specs: ["Snapdragon 8 Gen 3", "200MP OIS Zoom", "Titanium Grade"],
      image: mobileImage,
      link: "/shop?category=mobile",
      accentGlow: "rgba(6, 182, 212, 0.25)",
    },
    {
      number: "03",
      title: "Cinema & Mirrorless",
      subtitle: "OPTICAL STORYTELLING",
      description: "Full-frame 33MP sensors with real-time AI autofocus and 4K 10-bit recording.",
      specs: ["Full-Frame Sensors", "Real-Time Eye AF", "4K ProRes 10-Bit"],
      image: cameraImage,
      link: "/shop?category=camera",
      accentGlow: "rgba(245, 158, 11, 0.25)",
    },
    {
      number: "04",
      title: "Studio Audio & ANC",
      subtitle: "ACOUSTIC PRECISION",
      description: "Reference-grade planar audio, adaptive noise cancellation, and spatial sound.",
      specs: ["Adaptive ANC", "Lossless Hi-Res", "40h Playtime"],
      image: headphonesImage,
      link: "/shop?category=accessories",
      accentGlow: "rgba(16, 185, 129, 0.25)",
    },
  ];

  // Brand Partners List for Marquee
  const partnerBrands = [
    "APPLE",
    "SONY",
    "SAMSUNG",
    "DELL",
    "ASUS ROG",
    "BOSE",
    "CANON",
    "RAZER",
    "LOGITECH",
    "ONEPLUS",
    "SENNHEISER",
    "DJI",
  ];

  // Why Us / Store Promise
  const features = [
    {
      icon: "verified",
      title: "100% Brand Sealed",
      description:
        "Direct manufacturer authorized inventory. Every device ships unopened with verifiable serial numbers.",
      tag: "ORIGINAL WARRANTY",
    },
    {
      icon: "local_shipping",
      title: "Insured 48-Hour Delivery",
      description:
        "Real-time GPS tracking and tamper-evident courier dispatch across 20,000+ pin codes nationwide.",
      tag: "TRANSIT SECURED",
    },
    {
      icon: "swap_horizontal_circle",
      title: "7-Day Doorstep Replacement",
      description:
        "Encountered a factory defect? Instant reverse pickup and direct replacement without lengthy service queues.",
      tag: "ZERO HEADACHE",
    },
    {
      icon: "shield_lock",
      title: "Razorpay Encrypted Vault",
      description:
        "256-bit SSL secured payments with support for 0% No-cost EMI, UPI, corporate GST cards, and net banking.",
      tag: "SAFE & TRUSTED",
    },
  ];

  // Customer Reviews
  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Lead Systems Architect",
      company: "Bangalore",
      device: "Apple MacBook Pro 16\" M3 Max",
      rating: 5,
      comment:
        "The MacBook Pro arrived factory-sealed in heavy-duty protective air cushion packaging within 36 hours. Running Docker, 3 VMs, and local LLMs without a hiccup. Nexus Tech is now our team's official hardware vendor.",
    },
    {
      name: "Sneha Patel",
      role: "Cinematographer & Director",
      company: "Mumbai",
      device: "Sony Alpha 7 IV Cinema Rig",
      rating: 5,
      comment:
        "Applied the SAVE10 coupon and saved over ₹15,000 on my Sony camera body and G-Master prime. Customer support verified the sensor serial number with Sony India before dispatch. Truly exceptional service!",
    },
    {
      name: "Rohan Verma",
      role: "AI Researcher",
      company: "Hyderabad",
      device: "Dell XPS 15 OLED",
      rating: 5,
      comment:
        "The 3.5K OLED InfinityEdge screen is simply sublime for color work and code readability. Smooth Razorpay EMI checkout and accurate order tracking. Highly recommended for professionals.",
    },
  ];

  // Tech FAQ data
  const faqs = [
    {
      q: "Are all products brand-new and covered under official manufacturer warranty?",
      a: "Yes, 100%. Nexus Tech is an authorized distributor. All laptops, smartphones, and cameras are brand-new, factory-sealed, and come with direct manufacturer warranties (e.g., Apple Care, Sony India, Dell ProSupport). You can claim warranty at any authorized brand service center nationwide.",
    },
    {
      q: "How does the 48-Hour Insured Express Delivery work?",
      a: "Orders placed before 2:00 PM are dispatched the same business day from our climate-controlled fulfillment hubs. All packages are insured against transit damage or theft and shipped in tamper-evident reinforced boxes with live OTP delivery verification.",
    },
    {
      q: "Can I claim GST input tax credit for business purchases?",
      a: "Absolutely. During checkout, simply toggle 'Add GST Details' and provide your company's registered GSTIN and legal name. A tax invoice with compliant HSN codes will be generated and emailed automatically upon dispatch.",
    },
    {
      q: "What is your 7-Day Replacement Policy?",
      a: "If your hardware arrives with any manufacturing defect, physical transit damage, or technical inconsistency, initiate a replacement from your Orders dashboard within 7 days. We provide free doorstep reverse pickup and ship a brand-new sealed unit.",
    },
    {
      q: "What EMI and financing payment options are available?",
      a: "We support 0% No-cost EMI and low-interest flexible tenures (3, 6, 9, 12, 18, 24 months) across all major banks including HDFC, ICICI, SBI, Axis, and American Express, plus cardless UPI credit through Razorpay.",
    },
  ];

  return (
    <main className="nexus-home-root">
      {/* ========================================================
          1. HERO SECTION: ULTRA-MODERN FLAGSHIP SHOWCASE
      ======================================================== */}
      <section className="nexus-hero-section">
        {/* Background Ambient Glows */}
        <div className="hero-mesh-background" />
        <div className="hero-radial-glow glow-top-right" />
        <div className="hero-radial-glow glow-bottom-left" />

        <div className="hero-inner-container">
          {/* Hero Left Column: Copy & Actions */}
          <div className="hero-text-column">
            {/* Live Status Badge */}
            <div className="hero-live-badge">
              <span className="live-pulse-dot" />
              <span className="badge-tag-text">{currentHero.tag}</span>
              <span className="badge-sep">•</span>
              <span className="badge-stock-text">IN STOCK</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-main-title">
              {activeHeroTab === 0 ? (
                <>
                  Architected for Speed.
                  <br />
                  <span className="text-gradient-purple">Built for Tomorrow.</span>
                </>
              ) : (
                <>
                  {currentHero.title.split("&")[0]}
                  <br />
                  <span className="text-gradient-purple">
                    {currentHero.title.split("&")[1] || "Engineered for Pro Work"}
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p className="hero-lead-text">{currentHero.description}</p>

            {/* Flagship Specs Chips */}
            <div className="hero-specs-pills">
              {currentHero.specs.map((spec, i) => (
                <span key={i} className="spec-pill">
                  <span className="material-symbols-outlined spec-icon">bolt</span>
                  {spec}
                </span>
              ))}
            </div>

            {/* Interactive Hero Switcher Tabs */}
            <div className="hero-device-switcher">
              <span className="switcher-label">SELECT SHOWCASE:</span>
              <div className="switcher-tabs-wrap">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveHeroTab(index)}
                    className={`switcher-tab-btn ${activeHeroTab === index ? "active" : ""}`}
                    aria-label={`View ${slide.label}`}
                  >
                    {slide.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons Group */}
            <div className="hero-actions-group">
              <Link to={currentHero.targetCategory} className="btn-hero-primary">
                <span>Explore Catalog</span>
                <span className="material-symbols-outlined btn-arrow">arrow_forward</span>
              </Link>

              <a href="#flash-deal" className="btn-hero-secondary">
                <span className="material-symbols-outlined deal-sparkle">local_fire_department</span>
                <span>Deal of the Day</span>
              </a>

              <div className="hero-price-preview">
                <small>Prices From</small>
                <strong>{currentHero.priceFrom}</strong>
              </div>
            </div>

            {/* Micro Trust Points */}
            <div className="hero-micro-trust">
              <div className="micro-trust-item">
                <span className="material-symbols-outlined trust-check">verified</span>
                <span>100% Brand Sealed</span>
              </div>
              <div className="micro-trust-item">
                <span className="material-symbols-outlined trust-check">local_shipping</span>
                <span>48h Express Dispatch</span>
              </div>
              <div className="micro-trust-item">
                <span className="material-symbols-outlined trust-check">published_with_changes</span>
                <span>7-Day Replacement</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: 3D Composition & Interactive Floating Badges */}
          <div className="hero-visual-column">
            <div className="visual-stage-wrapper">
              {/* Backlight halo */}
              <div className="stage-halo" />

              {/* Main Product Showcase Image */}
              <div className="stage-image-container">
                <img
                  key={currentHero.image}
                  src={currentHero.image}
                  alt={currentHero.title}
                  className="stage-main-image fade-in-scale"
                />
              </div>

              {/* Floating Glass Badge 1: Customer Satisfaction */}
              <div className="hero-floating-glass glass-pos-top-left">
                <div className="glass-icon-circle bg-amber">
                  <span className="material-symbols-outlined text-amber">star</span>
                </div>
                <div className="glass-text-block">
                  <strong>4.9 / 5.0 Rating</strong>
                  <p>14,200+ Verified Buyers</p>
                </div>
              </div>

              {/* Floating Glass Badge 2: Dispatch Notice */}
              <div className="hero-floating-glass glass-pos-bottom-right">
                <div className="glass-icon-circle bg-emerald">
                  <span className="material-symbols-outlined text-emerald">bolt</span>
                </div>
                <div className="glass-text-block">
                  <strong>Instant Dispatch</strong>
                  <p>Guaranteed within 24h</p>
                </div>
              </div>

              {/* Floating Glass Badge 3: Discount Code Quick-Copy */}
              <button
                className="hero-floating-coupon-card"
                onClick={() => handleCopyCoupon("SAVE10")}
                title="Click to copy coupon code"
              >
                <div className="coupon-card-header">
                  <span className="coupon-sparkle">✦</span>
                  <span className="coupon-title">VIP PROMO</span>
                  <span className="coupon-chip">10% OFF</span>
                </div>
                <div className="coupon-code-pill">
                  <code>SAVE10</code>
                  <span className="copy-state-label">
                    {copiedCode ? "✓ Copied" : "Copy"}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. METRICS & REPUTATION COUNTER STRIP
      ======================================================== */}
      <section className="nexus-metrics-strip">
        <div className="metrics-container">
          <div className="metric-card">
            <div className="metric-icon-wrap">
              <span className="material-symbols-outlined">package_2</span>
            </div>
            <div className="metric-info">
              <h3 className="metric-number">50,000+</h3>
              <p className="metric-label">Flagships Shipped Nationwide</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap">
              <span className="material-symbols-outlined">workspace_premium</span>
            </div>
            <div className="metric-info">
              <h3 className="metric-number">100%</h3>
              <p className="metric-label">Authorized Brand Sealed Guarantee</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap">
              <span className="material-symbols-outlined">reviews</span>
            </div>
            <div className="metric-info">
              <h3 className="metric-number">4.9 ★</h3>
              <p className="metric-label">From 14,200+ Verified Customers</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-wrap">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <div className="metric-info">
              <h3 className="metric-number">48 Hours</h3>
              <p className="metric-label">Guaranteed Insured Transit Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. BRAND MARQUEE (INFINITE LUXURY LOGO STRIP)
      ======================================================== */}
      <section className="nexus-brands-marquee">
        <div className="marquee-label">
          <span>AUTHORIZED DEALERSHIP ECOSYSTEM</span>
        </div>
        <div className="marquee-scroller-wrap">
          <div className="marquee-track">
            {partnerBrands.concat(partnerBrands).map((brand, idx) => (
              <div key={idx} className="marquee-brand-item">
                <span className="marquee-brand-bullet">✦</span>
                <span className="marquee-brand-name">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. BENTO GRID: CURATED CATEGORIES
      ======================================================== */}
      <section className="nexus-section bento-categories-section">
        <div className="section-header-row">
          <div>
            <span className="section-pre-title">CURATED CATALOG</span>
            <h2 className="section-title">
              Explore By <span>Category.</span>
            </h2>
            <p className="section-subtitle">
              Precision-tuned computing, imaging, and audio hardware structured for creator workflows.
            </p>
          </div>
          <Link to="/shop" className="btn-link-all">
            <span>Browse All Collections</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

        <div className="bento-category-grid">
          {categories.map((cat, idx) => (
            <Link
              to={cat.link}
              key={cat.title}
              className={`bento-category-card bento-card-${idx}`}
              style={{ "--card-glow": cat.accentGlow }}
            >
              <div className="bento-card-bg-glow" />

              <div className="bento-card-content">
                <div className="bento-badge-row">
                  <span className="bento-number">{cat.number}</span>
                  <span className="bento-subtitle">{cat.subtitle}</span>
                </div>

                <h3 className="bento-title">{cat.title}</h3>
                <p className="bento-desc">{cat.description}</p>

                <div className="bento-specs-row">
                  {cat.specs.map((spec, i) => (
                    <span key={i} className="bento-spec-tag">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="bento-cta-link">
                  <span>Explore Collection</span>
                  <span className="material-symbols-outlined bento-arrow">arrow_forward</span>
                </div>
              </div>

              <div className="bento-image-container">
                <img src={cat.image} alt={cat.title} className="bento-product-img" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          5. DEAL OF THE DAY / FLASH SALE (INTERACTIVE URGENCY)
      ======================================================== */}
      <section id="flash-deal" className="nexus-section flash-deal-section">
        <div className="flash-deal-card">
          <div className="flash-deal-mesh" />

          <div className="flash-deal-grid">
            {/* Left Content */}
            <div className="flash-deal-info">
              <div className="flash-pill">
                <span className="material-symbols-outlined flash-icon">local_fire_department</span>
                <span>LIMITED TIME LIGHTNING DEAL</span>
              </div>

              <h2 className="flash-title">
                Apple MacBook Pro 16"
                <br />
                <span className="text-gradient-purple">M3 Max Flagship Edition</span>
              </h2>

              <p className="flash-description">
                16-Core CPU, 40-Core GPU, 36GB Unified Memory, and 1TB SSD. The ultimate powerhouse for software architects, video editors, and machine learning engineers.
              </p>

              {/* Countdown Timer */}
              <div className="flash-countdown-block">
                <span className="countdown-lead">DEAL ENDS IN:</span>
                <div className="countdown-timer-boxes">
                  <div className="timer-unit">
                    <span className="timer-num">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="timer-tag">HOURS</span>
                  </div>
                  <span className="timer-col">:</span>
                  <div className="timer-unit">
                    <span className="timer-num">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="timer-tag">MINS</span>
                  </div>
                  <span className="timer-col">:</span>
                  <div className="timer-unit">
                    <span className="timer-num">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="timer-tag">SECS</span>
                  </div>
                </div>
              </div>

              {/* Claimed Inventory Progress Bar */}
              <div className="flash-progress-block">
                <div className="progress-labels">
                  <span>
                    <strong>86% Claimed</strong> (Only 4 units remain at this price)
                  </span>
                  <span className="stock-alert">Almost Sold Out</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: "86%" }} />
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flash-pricing-row">
                <div className="flash-price-box">
                  <span className="flash-curr-price">₹2,49,900</span>
                  <span className="flash-orig-price">₹2,69,900</span>
                  <span className="flash-save-badge">Save ₹20,000</span>
                </div>

                <div className="flash-actions">
                  <Link to="/shop?category=laptop" className="btn-flash-primary">
                    <span className="material-symbols-outlined">bolt</span>
                    <span>Claim Deal Now</span>
                  </Link>

                  <button
                    className="btn-flash-code"
                    onClick={() => handleCopyCoupon("SAVE10")}
                  >
                    <span>Use Code: <strong>SAVE10</strong></span>
                    <span className="material-symbols-outlined code-icon">
                      {copiedCode ? "check" : "content_copy"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Product Image */}
            <div className="flash-deal-visual">
              <div className="flash-visual-glow" />
              <img
                src={laptopImage}
                alt="MacBook Pro M3 Max"
                className="flash-device-img"
              />
              <div className="flash-floating-spec">
                <span className="spec-strong">M3 Max</span>
                <span className="spec-sub">3nm 16-Core CPU</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. INTERACTIVE PRODUCT SHOWCASE WITH FILTER TABS
      ======================================================== */}
      <section className="nexus-section catalog-showcase-section">
        <div className="section-header-row">
          <div>
            <span className="section-pre-title">FLAGSHIP REPOSITORY</span>
            <h2 className="section-title">
              Curated <span>Hardware.</span>
            </h2>
            <p className="section-subtitle">
              Inspect our certified catalog with verified specifications and immediate nationwide dispatch.
            </p>
          </div>

          {/* Interactive Catalog Tabs */}
          <div className="catalog-tabs-container">
            <button
              onClick={() => setActiveCatalogTab("all")}
              className={`catalog-tab-btn ${activeCatalogTab === "all" ? "active" : ""}`}
            >
              ✦ All Flagships
            </button>
            <button
              onClick={() => setActiveCatalogTab("laptop")}
              className={`catalog-tab-btn ${activeCatalogTab === "laptop" ? "active" : ""}`}
            >
              💻 Laptops
            </button>
            <button
              onClick={() => setActiveCatalogTab("mobile")}
              className={`catalog-tab-btn ${activeCatalogTab === "mobile" ? "active" : ""}`}
            >
              📱 Mobiles
            </button>
            <button
              onClick={() => setActiveCatalogTab("camera")}
              className={`catalog-tab-btn ${activeCatalogTab === "camera" ? "active" : ""}`}
            >
              📷 Cameras
            </button>
            <button
              onClick={() => setActiveCatalogTab("bestseller")}
              className={`catalog-tab-btn ${activeCatalogTab === "bestseller" ? "active" : ""}`}
            >
              ⭐ Best Sellers
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        {catalogProducts.length === 0 ? (
          <div className="catalog-empty-card">
            <span className="material-symbols-outlined empty-icon">devices</span>
            <h4>No items found in this category</h4>
            <p>Our inventory is synchronizing with real-time stock levels.</p>
            <button
              onClick={() => setActiveCatalogTab("all")}
              className="btn-hero-primary"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="catalog-cards-grid">
            {catalogProducts.map((prod) => (
              <div key={prod._id || prod.productId} className="catalog-card-item">
                <SingleProductCard product={prod} />
              </div>
            ))}
          </div>
        )}

        <div className="catalog-footer-cta">
          <Link to="/shop" className="btn-explore-catalog-large">
            <span>Explore Entire 2026 Collection</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* ========================================================
          7. HARDWARE ENGINEERING SPOTLIGHT (BENTO OF SPECS)
      ======================================================== */}
      <section className="nexus-section engineering-spotlight-section">
        <div className="engineering-card-wrapper">
          <div className="engineering-header text-center">
            <span className="section-pre-title">THE ARCHITECTURE OF SPEED</span>
            <h2 className="section-title text-white">
              Engineered For The <span>Top 1%.</span>
            </h2>
            <p className="engineering-lead mx-auto">
              Every device selected in our inventory meets rigorous thermal, computational, and build quality standards.
            </p>
          </div>

          <div className="engineering-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <span className="material-symbols-outlined">memory</span>
              </div>
              <span className="pillar-tag">SILICON ARCHITECTURE</span>
              <h3>3nm Computational Power</h3>
              <p>
                Next-gen node lithography providing unrivaled performance-per-watt, hardware-accelerated ray tracing, and on-device neural intelligence.
              </p>
              <div className="pillar-bullet-list">
                <span>✓ Up to 16 CPU cores & 40 GPU cores</span>
                <span>✓ Hardware ProRes encode/decode</span>
                <span>✓ Dedicated 16-core Neural Engines</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <span className="material-symbols-outlined">camera</span>
              </div>
              <span className="pillar-tag">OPTICAL ENGINEERING</span>
              <h3>Full-Frame Sensor Precision</h3>
              <p>
                Back-illuminated CMOS architectures engineered to capture wide dynamic range, extreme low-light sensitivity, and cinematic color science.
              </p>
              <div className="pillar-bullet-list">
                <span>✓ 33MP+ 35mm full-frame sensors</span>
                <span>✓ AI-based real-time subject tracking</span>
                <span>✓ 10-bit 4:2:2 uncompressed video output</span>
              </div>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <span className="pillar-tag">AEROSPACE MATERIALS</span>
              <h3>Titanium & Vapor Chambers</h3>
              <p>
                Machined from Grade 5 aerospace titanium and recycled unibody aluminum with custom vapor chambers preventing thermal throttling.
              </p>
              <div className="pillar-bullet-list">
                <span>✓ Sub-millimeter laser welded chassis</span>
                <span>✓ Up to 22-hour battery endurance</span>
                <span>✓ Ceramic Shield & Gorilla Armor glass</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. WHY NEXUS TECH? (THE 4 PILLARS OF EXCELLENCE)
      ======================================================== */}
      <section className="nexus-section store-pillars-section">
        <div className="text-center mb-5">
          <span className="section-pre-title">THE STORE PROMISE</span>
          <h2 className="section-title">
            Why Shop <span>With Us?</span>
          </h2>
          <p className="section-subtitle mx-auto">
            We eliminate the risks of online tech shopping with verified brand authenticity and white-glove customer care.
          </p>
        </div>

        <div className="features-grid-cards">
          {features.map((feat) => (
            <div className="feature-modern-card" key={feat.title}>
              <div className="feature-icon-wrapper">
                <span className="material-symbols-outlined">{feat.icon}</span>
              </div>
              <span className="feature-card-tag">{feat.tag}</span>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.description}</p>
              <div className="feature-hover-line" />
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. CUSTOMER EXPERIENCES & VERIFIED STORIES
      ======================================================== */}
      <section className="nexus-section testimonials-section">
        <div className="text-center mb-5">
          <span className="section-pre-title">AUTHENTIC REVIEWS</span>
          <h2 className="section-title">
            Loved By <span>Professionals.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Read real feedback from software engineers, filmmakers, and creators across India.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div className="testimonial-modern-card" key={idx}>
              <div className="testimonial-stars-row">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined star-icon">
                    star
                  </span>
                ))}
                <span className="verified-pill">
                  <span className="material-symbols-outlined check-sm">check_circle</span>
                  Verified Purchase
                </span>
              </div>

              <div className="testimonial-device-badge">
                <span className="material-symbols-outlined dev-icon">devices</span>
                <span>{t.device}</span>
              </div>

              <p className="testimonial-quote">"{t.comment}"</p>

              <div className="testimonial-author-row">
                <div className="author-avatar-initials">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="author-details">
                  <strong className="author-name">{t.name}</strong>
                  <span className="author-role">
                    {t.role} • {t.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          10. FREQUENTLY ASKED QUESTIONS (ACCORDION)
      ======================================================== */}
      <section className="nexus-section faq-section">
        <div className="faq-container-box">
          <div className="faq-heading-col">
            <span className="section-pre-title">BUYER ASSURANCE</span>
            <h2 className="section-title">
              Hardware <span>Queries.</span>
            </h2>
            <p className="section-subtitle">
              Everything you need to know about warranties, insured courier shipping, and financing.
            </p>

            <div className="faq-contact-card">
              <span className="material-symbols-outlined contact-icon">support_agent</span>
              <div>
                <strong>Need custom enterprise advice?</strong>
                <p>Our tech concierges are ready to help with workstation configs.</p>
              </div>
              <Link to="/contact" className="faq-contact-btn">
                Contact Concierge →
              </Link>
            </div>
          </div>

          <div className="faq-accordion-col">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`faq-item-card ${isOpen ? "open" : ""}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-q-text">{faq.q}</span>
                    <span className="material-symbols-outlined faq-toggle-icon">
                      {isOpen ? "remove" : "add"}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="faq-answer-wrap">
                      <p className="faq-a-text">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          11. FINAL TECH CONCIERGE BANNER
      ======================================================== */}
      <section className="nexus-section final-cta-section">
        <div className="final-cta-card">
          <div className="final-cta-mesh" />

          <div className="final-cta-content">
            <span className="cta-pill">✦ ELEVATE YOUR TECH STACK</span>
            <h2>
              Ready to Upgrade to <span>Next-Gen Performance?</span>
            </h2>
            <p>
              Shop India's most trusted catalog of factory-sealed laptops, smartphones, and mirrorless cameras. Use coupon <strong>SAVE10</strong> for an instant 10% discount on eligible gear.
            </p>

            <div className="final-cta-buttons">
              <Link to="/shop" className="btn-final-primary">
                <span>Explore Full Catalog</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/about" className="btn-final-secondary">
                <span>Why Nexus Tech</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
