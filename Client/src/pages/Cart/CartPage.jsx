import React, { useContext, useMemo, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState";
import { formatPrice } from "../../utils/formatCurrency";
import { notify } from "../../utils/notification";

const CartPage = () => {
  const {
    cart,
    addToCart,
    decreaseQty,
    removeFromCart,
    clearCart,
    addToWishlist,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const items = cart?.items || [];

  // Calculate cart summary
  const { totalItems, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, product) => {
        const quantity = Number(product.qty) || 0;
        const totalProductPrice = Number(product.price) || 0;

        acc.totalItems += quantity;
        acc.subtotal += totalProductPrice;

        return acc;
      },
      { totalItems: 0, subtotal: 0 }
    );
  }, [items]);

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discount = appliedCoupon?.discountAmount || 0;
  const estimatedTax = Math.round(subtotal * 0.05); // 5% GST
  const grandTotal = Math.max(0, subtotal + shipping + estimatedTax - discount);

  // Increase quantity
  const handleIncrease = (product) => {
    const unitPrice = Number(product.price) / Number(product.qty);
    addToCart(
      product.productId,
      product.title,
      unitPrice,
      1,
      product.imgSrc
    );
  };

  // Decrease quantity
  const handleDecrease = (product) => {
    if (product.qty <= 1) {
      if (window.confirm("Do you want to remove this item from your cart?")) {
        removeFromCart(product.productId);
      }
      return;
    }
    decreaseQty(product.productId, 1);
  };

  // Move to Wishlist
  const handleMoveToWishlist = (product) => {
    addToWishlist(product.productId);
    removeFromCart(product.productId);
  };

  // Handle Apply Coupon
  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      setApplyingCoupon(true);
      await applyCoupon(couponCode.trim(), subtotal);
      setCouponCode("");
    } catch {
      // Error handled in context
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Empty Cart UI
  if (items.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="shopping_cart"
          title="Your Shopping Cart is Empty"
          description="Looks like you haven't added anything to your cart yet. Explore our top tech products and start adding your favorites."
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "85vh" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span
            className="text-uppercase fw-bold small text-primary"
            style={{ letterSpacing: "1px" }}
          >
            SHOPPING BAG
          </span>
          <h1 className="fw-bold text-dark mb-1">Your Shopping Cart</h1>
          <p className="text-secondary mb-0">
            {totalItems} {totalItems === 1 ? "item" : "items"} currently in your cart
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to clear your entire cart?")) {
              clearCart();
            }
          }}
          className="btn btn-outline-danger rounded-pill px-4"
        >
          <span className="material-symbols-outlined align-middle me-1">
            delete_sweep
          </span>
          Clear Cart
        </button>
      </div>

      <div className="row g-4">
        {/* Cart Products List */}
        <div className="col-lg-8">
          <div
            className="p-3 p-md-4 bg-white rounded-4 border border-light-subtle shadow-sm"
            style={{ borderRadius: "20px" }}
          >
            {items.map((product) => {
              const quantity = Number(product.qty) || 1;
              const unitPrice = Number(product.price) / quantity;

              return (
                <div
                  key={product._id || product.productId}
                  className="py-3 py-md-4 border-bottom"
                >
                  <div className="row align-items-center g-3">
                    {/* Image */}
                    <div className="col-4 col-sm-3 col-md-2">
                      <Link
                        to={`/product/${product.productId}`}
                        className="d-block p-2 bg-light rounded-3 text-center"
                        style={{ height: "100px" }}
                      >
                        <img
                          src={product.imgSrc}
                          alt={product.title}
                          className="img-fluid h-100"
                          style={{ objectFit: "contain" }}
                        />
                      </Link>
                    </div>

                    {/* Title & Unit Price */}
                    <div className="col-8 col-sm-9 col-md-5">
                      <Link
                        to={`/product/${product.productId}`}
                        className="text-dark text-decoration-none fw-semibold d-block mb-1 text-truncate"
                        style={{ fontSize: "15px" }}
                      >
                        {product.title}
                      </Link>
                      <span className="text-secondary small d-block mb-2">
                        Unit Price: {formatPrice(unitPrice)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMoveToWishlist(product)}
                        className="btn btn-link text-decoration-none p-0 text-primary small d-inline-flex align-items-center gap-1"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          favorite_border
                        </span>
                        Save for later
                      </button>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="col-6 col-md-3">
                      <div
                        className="d-inline-flex align-items-center rounded-3 border bg-light overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => handleDecrease(product)}
                          className="btn btn-sm btn-light border-0 px-2 py-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                            remove
                          </span>
                        </button>
                        <span className="px-3 fw-bold small text-dark">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(product)}
                          className="btn btn-sm btn-light border-0 px-2 py-1"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                            add
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="col-6 col-md-2 text-end">
                      <div className="fw-bold fs-6 text-dark mb-1">
                        {formatPrice(product.price)}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.productId)}
                        className="btn btn-sm text-danger p-0 border-0"
                      >
                        <span className="material-symbols-outlined align-middle me-1" style={{ fontSize: "16px" }}>
                          delete
                        </span>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Shopping Link */}
          <div className="mt-4">
            <Link to="/shop" className="text-decoration-none text-secondary fw-semibold">
              <span className="material-symbols-outlined align-middle me-2">
                arrow_back
              </span>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary & Coupon */}
        <div className="col-lg-4">
          <div
            className="p-4 bg-white rounded-4 border border-light-subtle shadow-sm sticky-top"
            style={{ top: "90px", borderRadius: "20px" }}
          >
            <h4 className="fw-bold text-dark mb-4">Cart Summary</h4>

            {/* Subtotal */}
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Subtotal ({totalItems} items)</span>
              <span className="fw-semibold text-dark">{formatPrice(subtotal)}</span>
            </div>

            {/* Shipping */}
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Shipping Estimate</span>
              <span className={shipping === 0 ? "text-success fw-bold" : "fw-semibold"}>
                {shipping === 0 ? "FREE" : formatPrice(shipping)}
              </span>
            </div>

            {/* Tax */}
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary">Estimated Tax (5% GST)</span>
              <span className="fw-semibold text-dark">{formatPrice(estimatedTax)}</span>
            </div>

            {/* Discount if coupon applied */}
            {discount > 0 && (
              <div className="d-flex justify-content-between mb-2 text-success">
                <span>Coupon ({appliedCoupon?.code})</span>
                <span className="fw-bold">- {formatPrice(discount)}</span>
              </div>
            )}

            {/* Coupon Code Input */}
            <div className="my-3 pt-3 border-top">
              {appliedCoupon ? (
                <div className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-success-subtle border border-success-subtle">
                  <div className="small text-success fw-bold">
                    ✓ Code '{appliedCoupon.code}' Applied
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit} className="d-flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="form-control form-control-sm text-uppercase"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponCode.trim()}
                    className="btn btn-sm btn-dark px-3 fw-semibold"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </form>
              )}
            </div>

            <hr />

            {/* Grand Total */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <span className="fw-bold fs-5 text-dark">Grand Total</span>
              <span className="fw-bold fs-4 text-primary">{formatPrice(grandTotal)}</span>
            </div>

            {/* Checkout Button */}
            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="btn btn-primary w-100 py-3 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              Proceed to Checkout
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>

            <div className="text-center mt-3 text-secondary small d-flex align-items-center justify-content-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                lock
              </span>
              Safe and Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
