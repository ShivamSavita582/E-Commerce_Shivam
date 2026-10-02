import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import "./Navbar.css";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { logout, isAuthenticated, user, cart, wishlist } =
    useContext(AppContext);

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (Number(item.qty) || 0), 0) || 0;

  const wishlistCount = wishlist?.products?.length || 0;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/product/search/${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <header className="nexus-header sticky-top">
      {/* 1. TOP UTILITY ANNOUNCEMENT BAR */}
      <div className="top-announcement-bar">
        <div className="announcement-container">
          <div className="announcement-ticker">
            <span className="ticker-badge">SPECIAL OFFER</span>
            <span className="ticker-text">
              Use code <strong>SAVE10</strong> for 10% instant discount • Free Express Delivery on orders over ₹999
            </span>
          </div>

          <div className="announcement-links">
            <span className="currency-badge">🇮🇳 INR (₹)</span>
            <span className="announcement-sep">•</span>
            <Link to="/about" className="announcement-link">
              Our Story
            </Link>
            <span className="announcement-sep">•</span>
            <Link to="/contact" className="announcement-link">
              24/7 Support
            </Link>
            <span className="announcement-sep">•</span>
            <Link to="/orders" className="announcement-link">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="main-navbar">
        <div className="navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="nexus-brand">
            <div className="brand-logo-mark">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <div className="brand-title-wrap">
              <span className="brand-main-name">NEXUS</span>
              <span className="brand-sub-name">TECH</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="nexus-desktop-nav">
            <Link
              to="/"
              className={`nav-item-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>

            <Link
              to="/shop"
              className={`nav-item-link ${
                location.pathname === "/shop" && !location.search ? "active" : ""
              }`}
            >
              Shop All
            </Link>

            <Link
              to="/shop?category=laptop"
              className={`nav-item-link ${
                location.search.includes("category=laptop") ? "active" : ""
              }`}
            >
              Laptops
            </Link>

            <Link
              to="/shop?category=mobile"
              className={`nav-item-link ${
                location.search.includes("category=mobile") ? "active" : ""
              }`}
            >
              Phones
            </Link>

            <Link
              to="/shop?category=camera"
              className={`nav-item-link ${
                location.search.includes("category=camera") ? "active" : ""
              }`}
            >
              Cameras
            </Link>

            <Link
              to="/shop?category=accessories"
              className={`nav-item-link ${
                location.search.includes("category=accessories") ? "active" : ""
              }`}
            >
              Audio & More
            </Link>
          </nav>

          {/* Central Search Bar */}
          <form className="nexus-search-form" onSubmit={submitHandler}>
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="text"
              placeholder="Search MacBook, iPhone, Sony, Nikon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search catalog"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </form>

          {/* Right Action Icons & User Hub */}
          <div className="nexus-actions-hub">
            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="action-icon-pill"
              aria-label="Wishlist"
              title="Saved Items"
            >
              <span className="material-symbols-outlined">favorite</span>
              {wishlistCount > 0 && (
                <span className="action-counter-badge badge-heart">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="action-icon-pill"
              aria-label="Shopping Cart"
              title="View Cart"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartItemCount > 0 && (
                <span className="action-counter-badge badge-cart">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Authentication Hub */}
            {isAuthenticated ? (
              <div className="user-dropdown-container" ref={userMenuRef}>
                <button
                  type="button"
                  className="user-profile-trigger"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-expanded={userMenuOpen}
                >
                  <div className="user-avatar-circle">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                  <span className="user-greeting-name text-truncate">
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <span className="material-symbols-outlined dropdown-arrow">
                    {userMenuOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="user-popover-menu">
                    <div className="popover-header">
                      <strong>{user?.name}</strong>
                      <span className="text-secondary small d-block text-truncate">
                        {user?.email}
                      </span>
                      <span className={`role-badge ${user?.role === "admin" ? "admin" : "user"}`}>
                        {user?.role === "admin" ? "Store Administrator" : "Verified Customer"}
                      </span>
                    </div>

                    <div className="popover-divider"></div>

                    <Link to="/profile" className="popover-item">
                      <span className="material-symbols-outlined">person</span>
                      My Account & Address
                    </Link>

                    <Link to="/orders" className="popover-item">
                      <span className="material-symbols-outlined">package_2</span>
                      Orders & Tracking
                    </Link>

                    <Link to="/wishlist" className="popover-item">
                      <span className="material-symbols-outlined">favorite</span>
                      My Wishlist ({wishlistCount})
                    </Link>

                    {user?.role === "admin" && (
                      <Link to="/admin" className="popover-item text-primary fw-semibold">
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="popover-divider"></div>

                    <button
                      type="button"
                      className="popover-item logout-action"
                      onClick={handleLogout}
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons-group">
                <Link to="/login" className="btn-auth-login">
                  Sign In
                </Link>
                <Link to="/register" className="btn-auth-register">
                  Join VIP
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="mobile-hamburger-btn"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation drawer"
            >
              <span className="material-symbols-outlined">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE SLIDE-OVER DRAWER */}
      {mobileOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)}>
          <div
            className="mobile-drawer-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="nexus-brand">
                <div className="brand-logo-mark">
                  <span className="material-symbols-outlined">bolt</span>
                </div>
                <div className="brand-title-wrap">
                  <span className="brand-main-name">NEXUS</span>
                  <span className="brand-sub-name">TECH</span>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Mobile Search */}
            <form className="drawer-search-form" onSubmit={submitHandler}>
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            {/* Drawer Links */}
            <div className="drawer-nav-list">
              <Link to="/" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">home</span>
                Home
              </Link>

              <Link to="/shop" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">storefront</span>
                Shop All Collection
              </Link>

              <Link to="/shop?category=laptop" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">laptop_mac</span>
                Laptops & MacBooks
              </Link>

              <Link to="/shop?category=mobile" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">smartphone</span>
                Smartphones
              </Link>

              <Link to="/shop?category=camera" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">photo_camera</span>
                Cameras & Optics
              </Link>

              <Link to="/shop?category=accessories" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">headphones</span>
                Audio & Accessories
              </Link>

              <Link to="/wishlist" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">favorite</span>
                Wishlist ({wishlistCount})
              </Link>

              <Link to="/cart" className="drawer-link" onClick={() => setMobileOpen(false)}>
                <span className="material-symbols-outlined">shopping_bag</span>
                Cart ({cartItemCount})
              </Link>

              {isAuthenticated && user?.role === "admin" && (
                <Link to="/admin" className="drawer-link text-primary fw-semibold" onClick={() => setMobileOpen(false)}>
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  Admin Management Console
                </Link>
              )}
            </div>

            <div className="drawer-divider"></div>

            {/* Mobile Auth Bottom Section */}
            {isAuthenticated ? (
              <div className="drawer-user-section">
                <div className="drawer-user-info">
                  <div className="user-avatar-circle">
                    {(user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div>
                    <strong>{user?.name}</strong>
                    <small className="text-secondary d-block">{user?.email}</small>
                  </div>
                </div>

                <div className="d-flex flex-column gap-2 mt-3">
                  <Link
                    to="/profile"
                    className="btn btn-outline-dark btn-sm rounded-pill py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    to="/orders"
                    className="btn btn-outline-dark btn-sm rounded-pill py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Track Orders
                  </Link>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm rounded-pill py-2"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="drawer-auth-buttons">
                <Link
                  to="/login"
                  className="btn btn-outline-dark w-100 rounded-pill py-2 fw-semibold mb-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
