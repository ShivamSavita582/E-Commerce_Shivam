
import React from "react";

const CartItem = ({ cart }) => {
  const items = cart?.items || [];

  // Empty Cart
  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <div
          className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
          style={{
            width: "70px",
            height: "70px",
            background: "#f1f5f9",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "34px",
              color: "#64748b",
            }}
          >
            shopping_cart
          </span>
        </div>

        <h5 className="fw-bold mb-2">
          Your cart is empty
        </h5>

        <p className="text-secondary mb-0">
          Add some products to continue.
        </p>
      </div>
    );
  }

  return (
    <div className="cart-items">

      {items.map((product) => {
        // Cart me price total item price hai
        // Example: ₹500 × 2 = ₹1000
        const unitPrice =
          product.qty > 0
            ? Number(product.price) / Number(product.qty)
            : Number(product.price);

        const itemTotal = Number(product.price) || 0;

        return (
          <div
            key={product._id || product.productId}
            className="d-flex align-items-center gap-3 py-3"
            style={{
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {/* Product Image */}
            <div
              className="rounded-3 overflow-hidden flex-shrink-0"
              style={{
                width: "75px",
                height: "75px",
                background: "#f8fafc",
              }}
            >
              <img
                src={product.imgSrc}
                alt={product.title}
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>

            {/* Product Information */}
            <div
              className="flex-grow-1"
              style={{
                minWidth: 0,
              }}
            >
              <h6
                className="fw-semibold mb-1"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.title}
              </h6>

              <div className="d-flex align-items-center gap-2 flex-wrap">

                {/* Unit Price */}
                <span
                  className="small text-secondary"
                >
                  ₹{unitPrice.toFixed(2)}
                </span>

                <span className="text-secondary">
                  ×
                </span>

                {/* Quantity */}
                <span
                  className="badge rounded-pill"
                  style={{
                    background: "#eef2ff",
                    color: "#4f46e5",
                    fontWeight: "600",
                  }}
                >
                  {product.qty}
                </span>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-end flex-shrink-0">
              <div
                className="fw-bold"
                style={{
                  color: "#111827",
                }}
              >
                ₹{itemTotal.toFixed(2)}
              </div>
            </div>
          </div>
        );
      })}

      {/* Cart Summary */}
      <div
        className="pt-4 mt-2"
        style={{
          borderTop: "1px solid #e5e7eb",
        }}
      >
        {(() => {
          const totalQty = items.reduce(
            (total, item) =>
              total + Number(item.qty || 0),
            0
          );

          const totalPrice = items.reduce(
            (total, item) =>
              total + Number(item.price || 0),
            0
          );

          return (
            <>
              {/* Total Items */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Total Items
                </span>

                <span className="fw-semibold">
                  {totalQty}
                </span>
              </div>

              {/* Delivery */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">
                  Delivery
                </span>

                <span className="fw-semibold text-success">
                  FREE
                </span>
              </div>

              {/* Total */}
              <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <span className="fw-bold fs-5">
                  Total
                </span>

                <span
                  className="fw-bold fs-4"
                  style={{
                    color: "#4f46e5",
                  }}
                >
                  ₹{totalPrice.toFixed(2)}
                </span>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default CartItem;
