import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import EmptyState from "../../components/common/EmptyState";
import { formatPrice } from "../../utils/formatCurrency";
import "./Wishlist.css";

const Wishlist = () => {
  const {
    wishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    isAuthenticated,
    products,
  } = useContext(AppContext);

  const [addedMap, setAddedMap] = useState({});

  const items = wishlist?.products || [];

  // Helper to resolve product document even if item only stored the ID
  const resolveProduct = (item) => {
    if (!item) return null;
    let prod = item.productId;
    if (typeof prod === "string" || (prod && !prod.title)) {
      const prodId = typeof prod === "string" ? prod : prod._id;
      const found = (products || []).find(
        (p) => p._id?.toString() === prodId?.toString()
      );
      if (found) return found;
    }
    return prod;
  };

  const handleAddToCart = async (pId, product) => {
    if (!product) return;
    try {
      await addToCart(
        pId,
        product.title,
        product.price,
        1,
        product.imgSrc || (product.images && product.images[0])
      );
      setAddedMap((prev) => ({ ...prev, [pId]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [pId]: false }));
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (items.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <EmptyState
            icon="favorite"
            title="Your Wishlist is Empty"
            description="You haven't saved any favorite items yet. Explore our curated catalog and tap the heart icon to save products."
            actionText="Explore Tech Catalog"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        {/* Guest alert if not authenticated */}
        {!isAuthenticated && (
          <div className="wishlist-guest-banner mb-4 p-3 rounded-4 bg-white border border-indigo-subtle d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm">
            <div className="d-flex align-items-center gap-2 text-dark">
              <span className="material-symbols-outlined text-primary">
                bookmark_border
              </span>
              <span>
                <strong>Guest Wishlist:</strong> Your saved items are currently stored in this browser session.
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-primary rounded-pill px-3">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary rounded-pill px-3">
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="wishlist-header">
          <div>
            <span className="text-uppercase fw-bold text-primary small" style={{ letterSpacing: "1.2px" }}>
              MY SAVED ITEMS
            </span>
            <h1 className="wishlist-title">My Wishlist</h1>
            <p className="wishlist-subtitle">
              You have {items.length} {items.length === 1 ? "product" : "products"} saved for later.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
                clearWishlist();
              }
            }}
            className="clear-wishlist-btn"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              delete_sweep
            </span>
            Clear Wishlist
          </button>
        </div>

        {/* Grid */}
        <div className="wishlist-grid">
          {items.map((item) => {
            const product = resolveProduct(item);
            if (!product) return null;

            const pId = product._id || product.productId;
            const isOutOfStock = product.qty !== undefined && product.qty <= 0;
            const isAdded = !!addedMap[pId];

            return (
              <div key={item._id || pId} className="wishlist-item-card">
                {/* Media */}
                <div className="wishlist-media">
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => removeFromWishlist(pId)}
                    title="Remove from wishlist"
                    aria-label="Remove from wishlist"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                      close
                    </span>
                  </button>

                  <Link to={`/product/${pId}`}>
                    <img
                      src={product.imgSrc || (product.images && product.images[0])}
                      alt={product.title}
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Details */}
                <div className="wishlist-details">
                  <span className="wishlist-cat">{product.category || "General"}</span>

                  <Link to={`/product/${pId}`} className="wishlist-prod-title">
                    {product.title}
                  </Link>

                  <div className="wishlist-price-row">
                    <span className="wishlist-price">{formatPrice(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="wishlist-old-price">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className={`wishlist-add-cart-btn ${isAdded ? "btn-added" : ""}`}
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(pId, product)}
                      style={isAdded ? { background: "#10b981", borderColor: "#10b981" } : {}}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        {isAdded ? "check" : "shopping_cart"}
                      </span>
                      {isOutOfStock ? "Out of Stock" : isAdded ? "Added!" : "Add to Cart"}
                    </button>

                    <Link to={`/product/${pId}`} className="wishlist-view-btn">
                      View
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
