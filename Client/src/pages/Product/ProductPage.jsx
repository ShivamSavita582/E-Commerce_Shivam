import React, { useState, useEffect, useContext, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { productService } from "../../services/productService";
import { reviewService } from "../../services/reviewService";
import RelatedProducts from "../../components/product/RelatedProducts";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { formatPrice } from "../../utils/formatCurrency";
import { notify } from "../../utils/notification";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isAuthenticated,
    user,
  } = useContext(AppContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");

  // Button state indicators
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        const prod = data.product;
        setProduct(prod);

        // Set default active image
        const initialImg =
          prod?.imgSrc || (prod?.images && prod.images[0]) || "";
        setSelectedImage(initialImg);

        // Fetch reviews
        if (prod?._id) {
          try {
            const reviewData = await reviewService.getProductReviews(prod._id);
            setReviews(reviewData.reviews || []);
          } catch {
            setReviews([]);
          }
        }
      } catch (error) {
        console.error("Failed to load product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-page">
        <LoadingSpinner text="Loading product experience..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page text-center py-5">
        <div className="container">
          <div className="empty-product-state">
            <span className="material-symbols-outlined empty-icon">
              production_quantity_limits
            </span>
            <h2 className="fw-bold mb-2">Product Not Available</h2>
            <p className="text-secondary mb-4">
              We couldn't find the product you're looking for. It might have been moved or is currently unavailable.
            </p>
            <Link to="/shop" className="btn btn-primary rounded-pill px-4 py-2">
              Browse All Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const pId = product._id;
  const isWishlisted = (wishlist?.products || []).some((item) => {
    const itemId = item?.productId?._id || item?.productId || item?._id;
    return itemId?.toString() === pId?.toString();
  });

  const isOutOfStock = product.qty !== undefined && product.qty <= 0;
  const maxStock = product.qty || 15;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => {
      const next = prev + delta;
      if (next < 1) return 1;
      if (next > maxStock) {
        notify.warning(`Maximum available stock is ${maxStock} units.`);
        return maxStock;
      }
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return;
    try {
      setIsAdding(true);
      await addToCart(
        pId,
        product.title,
        product.price,
        quantity,
        selectedImage || product.imgSrc
      );
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2200);
    } catch (err) {
      console.error("Add to cart error:", err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock || isBuying) return;
    try {
      setIsBuying(true);
      await addToCart(
        pId,
        product.title,
        product.price,
        quantity,
        selectedImage || product.imgSrc
      );
      navigate("/cart");
    } catch (err) {
      console.error("Buy now error:", err);
    } finally {
      setIsBuying(false);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(pId);
    } else {
      addToWishlist(pId);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      notify.info("Please sign in to submit a verified review.");
      navigate("/login");
      return;
    }
    if (!userComment.trim()) {
      notify.warning("Please share your feedback in the review box.");
      return;
    }

    try {
      setSubmittingReview(true);
      const data = await reviewService.addReview({
        productId: pId,
        rating: userRating,
        comment: userComment.trim(),
      });

      if (data?.success) {
        notify.success("Thank you! Your verified review has been posted.");
        setUserComment("");
        const updated = await reviewService.getProductReviews(pId);
        setReviews(updated.reviews || []);
        setActiveTab("reviews");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to submit review";
      notify.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Image list
  const allImages = [
    product.imgSrc,
    ...(Array.isArray(product.images) ? product.images : []),
  ].filter(Boolean);

  const uniqueImages = [...new Set(allImages)];

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null);

  const quickSpecs = Object.entries(product.specifications || {}).slice(0, 4);

  return (
    <div className="product-details-page">
      <div className="product-details-container">
        {/* Modern Breadcrumb */}
        <nav className="product-breadcrumb" aria-label="breadcrumb">
          <Link to="/" className="breadcrumb-item-link">
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              home
            </span>
            Home
          </Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/shop" className="breadcrumb-item-link">
            Shop
          </Link>
          <span className="breadcrumb-sep">›</span>
          <Link
            to={`/shop?category=${product.category}`}
            className="breadcrumb-item-link text-capitalize"
          >
            {product.category}
          </Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current text-truncate" style={{ maxWidth: "280px" }}>
            {product.title}
          </span>
        </nav>

        {/* ================= MAIN PRODUCT HERO GRID ================= */}
        <div className="product-main-grid">
          {/* LEFT: GALLERY SHOWCASE */}
          <div className="gallery-section">
            <div className="main-image-card">
              {/* Overlay Badges */}
              <div className="gallery-badges">
                {discountPercent > 0 && (
                  <span className="badge-pill badge-discount">
                    -{discountPercent}% OFF
                  </span>
                )}
                {product.freeShipping && (
                  <span className="badge-pill badge-shipping">
                    FREE DELIVERY
                  </span>
                )}
                {product.isFeatured && (
                  <span className="badge-pill badge-flagship">
                    FLAGSHIP
                  </span>
                )}
              </div>

              {/* Main Product Image Container */}
              <div className="main-image-container">
                <img
                  src={selectedImage || product.imgSrc}
                  alt={product.title}
                  className="main-product-img"
                />
              </div>

              {/* Quick Image Zoom Indicator */}
              <span className="zoom-hint">
                <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
                  zoom_in
                </span>
                Hover to Zoom
              </span>
            </div>

            {/* Thumbnail Row */}
            {uniqueImages.length > 1 && (
              <div className="thumbnails-row">
                {uniqueImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumbnail-btn ${
                      selectedImage === img ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(img)}
                    title={`View angle ${idx + 1}`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Tiles under Gallery */}
            <div className="gallery-trust-bar">
              <div className="trust-tile">
                <span className="material-symbols-outlined">verified_user</span>
                <div>
                  <strong>Brand Certified</strong>
                  <small>100% Genuine Tech</small>
                </div>
              </div>

              <div className="trust-tile">
                <span className="material-symbols-outlined">local_shipping</span>
                <div>
                  <strong>Fast Delivery</strong>
                  <small>Dispatched in 24h</small>
                </div>
              </div>

              <div className="trust-tile">
                <span className="material-symbols-outlined">published_with_changes</span>
                <div>
                  <strong>7 Days Returns</strong>
                  <small>Instant Doorstep Pickup</small>
                </div>
              </div>

              <div className="trust-tile">
                <span className="material-symbols-outlined">shield_lock</span>
                <div>
                  <strong>Razorpay Secure</strong>
                  <small>256-bit SSL Protected</small>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: BUYING CENTER & SPECIFICATIONS */}
          <div className="product-info-section">
            {/* Top Brand Pill & Availability */}
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <span className="product-brand-tag">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  verified
                </span>
                {product.brand || "Official Brand Store"} • {product.category?.toUpperCase()}
              </span>

              {/* Stock status indicator */}
              <div className={`stock-status-pill ${isOutOfStock ? "out" : "in"}`}>
                <span className="stock-dot"></span>
                <span>
                  {isOutOfStock
                    ? "Currently Out of Stock"
                    : `In Stock (${product.qty || 12} units available)`}
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="product-main-title">{product.title}</h1>

            {/* Rating Bar */}
            <div className="product-rating-bar">
              <div className="rating-pill">
                <span className="material-symbols-outlined star-icon">star</span>
                <strong className="rating-score">{product.rating || 4.8}</strong>
              </div>
              <span className="rating-divider">•</span>
              <button
                type="button"
                className="reviews-trigger"
                onClick={() => {
                  setActiveTab("reviews");
                  const el = document.getElementById("product-tabs");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {reviews.length || product.reviewCount || 16} Verified Reviews
              </button>
              {product.sku && (
                <>
                  <span className="rating-divider">•</span>
                  <span className="text-muted small">SKU: {product.sku}</span>
                </>
              )}
            </div>

            {/* Pricing Card */}
            <div className="product-pricing-card">
              <div className="d-flex align-items-baseline gap-3 flex-wrap">
                <span className="price-main">{formatPrice(product.price)}</span>
                {product.originalPrice > product.price && (
                  <span className="price-original">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="price-save-badge">
                    Save {formatPrice(product.originalPrice - product.price)} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
              <p className="tax-inclusive-text">
                Inclusive of all taxes • No-Cost EMI starting at ₹
                {Math.round(product.price / 12).toLocaleString()}/month
              </p>
            </div>

            {/* Short Highlights */}
            {product.shortDescription && (
              <p className="product-short-desc">{product.shortDescription}</p>
            )}

            {/* Top 4 Quick Specs Chips */}
            {quickSpecs.length > 0 && (
              <div className="quick-specs-grid">
                {quickSpecs.map(([label, val]) => (
                  <div key={label} className="quick-spec-pill">
                    <span className="spec-label text-capitalize">{label}</span>
                    <strong className="spec-val text-truncate">{val}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* ================= PURCHASE CONTROLS ================= */}
            <div className="purchase-controls-box">
              {/* Quantity Stepper */}
              <div className="qty-row">
                <span className="qty-label">Quantity:</span>
                <div className="qty-stepper-control">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="stepper-count">{quantity}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxStock || isOutOfStock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <small className="text-muted">
                  Max {maxStock} per order
                </small>
              </div>

              {/* Main Action Buttons */}
              <div className="actions-button-group">
                {/* ADD TO CART BUTTON */}
                <button
                  type="button"
                  id="btn-add-to-cart"
                  className={`btn-cart-main ${addedSuccess ? "added" : ""}`}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isAdding}
                >
                  {isAdding ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Adding to Cart...</span>
                    </>
                  ) : addedSuccess ? (
                    <>
                      <span className="material-symbols-outlined">check_circle</span>
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">shopping_bag</span>
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                {/* BUY NOW BUTTON */}
                <button
                  type="button"
                  id="btn-buy-now"
                  className="btn-buy-instant"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isBuying}
                >
                  {isBuying ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">bolt</span>
                      <span>Buy Now</span>
                    </>
                  )}
                </button>

                {/* WISHLIST BUTTON */}
                <button
                  type="button"
                  id="btn-wishlist"
                  className={`btn-wishlist-toggle ${isWishlisted ? "active" : ""}`}
                  onClick={handleWishlistToggle}
                  title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                  aria-label="Toggle Wishlist"
                >
                  <span className="material-symbols-outlined">
                    {isWishlisted ? "favorite" : "favorite_border"}
                  </span>
                </button>
              </div>
            </div>

            {/* Delivery Timeline Card */}
            <div className="delivery-card">
              <div className="d-flex align-items-center gap-3">
                <span className="material-symbols-outlined delivery-icon">
                  local_shipping
                </span>
                <div>
                  <h6 className="mb-0 fw-bold">Express Insured Delivery</h6>
                  <p className="mb-0 text-secondary small">
                    Order today to receive delivery within <strong>2-4 business days</strong>. Free returns within 7 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= TABS: OVERVIEW, SPECS, REVIEWS, SHIPPING ================= */}
        <div className="product-tabs-container" id="product-tabs">
          <div className="tabs-header-nav">
            <button
              type="button"
              className={`tab-link-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="material-symbols-outlined">description</span>
              Overview & Features
            </button>

            <button
              type="button"
              className={`tab-link-btn ${activeTab === "specifications" ? "active" : ""}`}
              onClick={() => setActiveTab("specifications")}
            >
              <span className="material-symbols-outlined">tune</span>
              Technical Specifications
            </button>

            <button
              type="button"
              className={`tab-link-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <span className="material-symbols-outlined">reviews</span>
              Verified Reviews ({reviews.length})
            </button>

            <button
              type="button"
              className={`tab-link-btn ${activeTab === "shipping" ? "active" : ""}`}
              onClick={() => setActiveTab("shipping")}
            >
              <span className="material-symbols-outlined">policy</span>
              Warranty & Delivery
            </button>
          </div>

          <div className="tab-pane-card">
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="overview-pane">
                <h3 className="pane-heading">Engineered for Peak Performance</h3>
                <p className="pane-lead-text">{product.description}</p>

                <div className="row g-4 mt-3">
                  <div className="col-12 col-md-4">
                    <div className="feature-highlight-box">
                      <span className="material-symbols-outlined highlight-icon">
                        verified
                      </span>
                      <h5>Original Hardware</h5>
                      <p>
                        Sourced straight from certified brand distributions with serialized manufacturer warranty.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="feature-highlight-box">
                      <span className="material-symbols-outlined highlight-icon">
                        speed
                      </span>
                      <h5>Tested Benchmark</h5>
                      <p>
                        High-efficiency silicon and components verified to operate under heavy workloads without thermal throttling.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="feature-highlight-box">
                      <span className="material-symbols-outlined highlight-icon">
                        eco
                      </span>
                      <h5>Eco-Conscious Packaging</h5>
                      <p>
                        Shipped in 100% recyclable, shock-resistant protective enclosures.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SPECIFICATIONS */}
            {activeTab === "specifications" && (
              <div className="specifications-pane">
                <h3 className="pane-heading">Full Technical Details</h3>
                <div className="specs-table-wrapper">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <td className="spec-th">Device Category</td>
                        <td className="spec-td text-capitalize">{product.category}</td>
                      </tr>
                      <tr>
                        <td className="spec-th">Official Brand</td>
                        <td className="spec-td">{product.brand || "Flagship Hardware"}</td>
                      </tr>
                      {product.sku && (
                        <tr>
                          <td className="spec-th">SKU Identifier</td>
                          <td className="spec-td">{product.sku}</td>
                        </tr>
                      )}
                      {product.warranty && (
                        <tr>
                          <td className="spec-th">Warranty Protection</td>
                          <td className="spec-td">{product.warranty}</td>
                        </tr>
                      )}
                      {product.returnPolicy && (
                        <tr>
                          <td className="spec-th">Return Guarantee</td>
                          <td className="spec-td">{product.returnPolicy}</td>
                        </tr>
                      )}
                      {product.specifications &&
                        Object.entries(product.specifications).map(([key, val]) => (
                          <tr key={key}>
                            <td className="spec-th text-capitalize">{key}</td>
                            <td className="spec-td">{val}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: VERIFIED REVIEWS */}
            {activeTab === "reviews" && (
              <div className="reviews-pane">
                <div className="row g-4">
                  {/* Reviews Summary */}
                  <div className="col-12 col-lg-5">
                    <div className="review-summary-card">
                      <h4 className="fw-bold mb-1">Customer Ratings</h4>
                      <p className="text-secondary small mb-3">
                        Based on verified customer purchase ratings
                      </p>

                      <div className="d-flex align-items-center gap-3 mb-4">
                        <span className="score-big">{product.rating || 4.8}</span>
                        <div>
                          <div className="d-flex text-warning mb-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span
                                key={s}
                                className="material-symbols-outlined"
                                style={{ fontSize: "22px" }}
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-muted small">
                            {reviews.length || product.reviewCount || 16} Verified Reviews
                          </span>
                        </div>
                      </div>

                      {/* Write a Review Box */}
                      <div className="review-composer-card">
                        <h5 className="fw-bold mb-2">Write a Review</h5>
                        <p className="text-secondary small mb-3">
                          Rate this product and share your hands-on feedback.
                        </p>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-3">
                            <label className="form-label small fw-semibold text-secondary">
                              Select Star Rating:
                            </label>
                            <div className="d-flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  className="btn p-0 border-0"
                                  onClick={() => setUserRating(star)}
                                >
                                  <span
                                    className="material-symbols-outlined"
                                    style={{
                                      fontSize: "30px",
                                      color:
                                        star <= userRating ? "#f59e0b" : "#cbd5e1",
                                      cursor: "pointer",
                                    }}
                                  >
                                    star
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <textarea
                              className="form-control rounded-3"
                              rows="3"
                              placeholder="Describe build quality, real-world battery life, performance..."
                              value={userComment}
                              onChange={(e) => setUserComment(e.target.value)}
                              required
                            ></textarea>
                          </div>

                          <button
                            type="submit"
                            disabled={submittingReview}
                            className="btn btn-dark w-100 rounded-pill py-2 fw-semibold"
                          >
                            {submittingReview ? "Submitting..." : "Submit Verified Review"}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="col-12 col-lg-7">
                    <h4 className="fw-bold mb-3">Verified Buyer Feedback</h4>
                    {reviews.length === 0 ? (
                      <div className="empty-reviews-box">
                        <span className="material-symbols-outlined text-secondary" style={{ fontSize: "40px" }}>
                          rate_review
                        </span>
                        <h5 className="fw-bold mt-2">No Reviews Yet</h5>
                        <p className="text-secondary small mb-0">
                          Be the first to review this device and help others make informed purchase decisions!
                        </p>
                      </div>
                    ) : (
                      <div className="reviews-feed">
                        {reviews.map((rev) => (
                          <div key={rev._id} className="customer-review-bubble">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center gap-2">
                                <div className="reviewer-avatar">
                                  {(rev.userName || "U")[0].toUpperCase()}
                                </div>
                                <div>
                                  <strong className="d-block reviewer-name">
                                    {rev.userName || "Verified Buyer"}
                                  </strong>
                                  <span className="verified-badge">
                                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                                      verified
                                    </span>
                                    Verified Purchase
                                  </span>
                                </div>
                              </div>

                              <div className="d-flex text-warning">
                                {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className="material-symbols-outlined"
                                    style={{ fontSize: "16px" }}
                                  >
                                    star
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="review-comment-body mb-1">{rev.comment}</p>
                            <small className="text-muted">
                              {rev.createdAt
                                ? new Date(rev.createdAt).toLocaleDateString()
                                : "Recent Purchase"}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SHIPPING & WARRANTY */}
            {activeTab === "shipping" && (
              <div className="shipping-pane">
                <h3 className="pane-heading">Delivery & Guarantee Terms</h3>
                <div className="row g-4 mt-1">
                  <div className="col-12 col-md-6">
                    <div className="policy-card">
                      <span className="material-symbols-outlined policy-icon">
                        local_shipping
                      </span>
                      <h5>Express Insured Logistics</h5>
                      <p className="text-secondary">
                        Orders are packed in electrostatic-safe packaging and dispatched within 24 hours via premium express carriers (BlueDart, Delhivery, Bluedart Air). Real-time tracking IDs provided immediately upon dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="policy-card">
                      <span className="material-symbols-outlined policy-icon">
                        published_with_changes
                      </span>
                      <h5>7-Day Doorstep Replacement</h5>
                      <p className="text-secondary">
                        If your item experiences hardware defects or transit damage, initiate a single-click return from your profile for an immediate courier pickup and replacement dispatch.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="policy-card">
                      <span className="material-symbols-outlined policy-icon">
                        verified_user
                      </span>
                      <h5>1-Year Direct Brand Warranty</h5>
                      <p className="text-secondary">
                        Every purchase comes with a direct invoice valid at all official service centers nationwide for complimentary repairs and replacements.
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="policy-card">
                      <span className="material-symbols-outlined policy-icon">
                        support_agent
                      </span>
                      <h5>Dedicated Helpdesk</h5>
                      <p className="text-secondary">
                        Questions about compatibility or setup? Our technical team is available Monday through Saturday from 9 AM to 8 PM to assist.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= RELATED PRODUCTS CAROUSEL/GRID ================= */}
        <div className="my-5">
          <RelatedProducts
            category={product.category}
            currentProductId={product._id}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPage;