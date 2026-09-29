import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { formatPrice } from "../../utils/formatCurrency";
import "./ProductCard.css";

// Individual Product Card Component
export const SingleProductCard = ({ product }) => {
  const { addToCart, wishlist, addToWishlist, removeFromWishlist } =
    useContext(AppContext);

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const productId = product._id || product.productId;
  const isOutOfStock = product.qty !== undefined && product.qty <= 0;

  // Check if in wishlist
  const isWishlisted = (wishlist?.products || []).some((item) => {
    const id = item?.productId?._id || item?.productId || item?._id;
    return id?.toString() === productId?.toString();
  });

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || adding) return;
    try {
      setAdding(true);
      await addToCart(
        productId,
        product.title,
        product.price,
        1,
        product.imgSrc || (product.images && product.images[0])
      );
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };

  const discountPercent =
    product.discount ||
    (product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : null);

  const ratingValue = product.rating || 4.5;
  const reviewTotal = product.reviewCount || product.numReviews || 12;

  return (
    <article className="premium-product-card" id={`product-${productId}`}>
      {/* Media Container */}
      <div className="product-card-media">
        {/* Badges */}
        <div className="card-badges">
          {discountPercent > 0 && (
            <span className="badge-discount">{discountPercent}% OFF</span>
          )}
          {isOutOfStock ? (
            <span className="badge-stock badge-out-stock">Out of Stock</span>
          ) : (
            <span className="badge-stock badge-in-stock">In Stock</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
            {isWishlisted ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Product Image */}
        <Link to={`/product/${productId}`}>
          <img
            src={product.imgSrc || (product.images && product.images[0])}
            alt={product.title}
            className="product-card-img"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <span className="product-card-category">{product.category || "General"}</span>

        <Link to={`/product/${productId}`} className="product-card-title">
          {product.title}
        </Link>

        {/* Rating */}
        <div className="product-card-rating">
          <div className="rating-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined"
                style={{
                  fontSize: "14px",
                  color: i < Math.floor(ratingValue) ? "#f59e0b" : "#cbd5e1",
                }}
              >
                star
              </span>
            ))}
          </div>
          <span className="rating-score">{ratingValue}</span>
          <span className="rating-count">({reviewTotal})</span>
        </div>

        {/* Footer */}
        <div className="product-card-footer">
          <div className="price-box">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            className={`card-cart-btn ${added ? "added" : ""}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            aria-label="Add to cart"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
              {added ? "check" : "shopping_cart"}
            </span>
            <span>{isOutOfStock ? "Sold Out" : added ? "Added!" : "Add"}</span>
          </button>
        </div>
      </div>
    </article>
  );
};

// Wrapper supporting both single product, list of items, or fallback to all products
const ProductCard = ({ product, items }) => {
  const { products } = useContext(AppContext);

  // If a single product is passed
  if (product) {
    return <SingleProductCard product={product} />;
  }

  // If items array is passed (e.g. from OrderConfirmation or custom view)
  const productList = items || products || [];

  return (
    <div className="row g-4 w-100">
      {productList.map((item) => (
        <div key={item._id || item.productId} className="col-12 col-sm-6 col-lg-4 col-xl-3">
          <SingleProductCard product={item} />
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
