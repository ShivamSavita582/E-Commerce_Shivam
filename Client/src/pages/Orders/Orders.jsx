import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import EmptyState from "../../components/common/EmptyState";
import { formatPrice } from "../../utils/formatCurrency";

const Orders = () => {
  const { userOrder, fetchOrders, isAuthenticated } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (fetchOrders) {
      fetchOrders();
    }
  }, [fetchOrders]);

  if (!isAuthenticated) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="lock"
          title="Sign in to View Orders"
          description="Please log in with your account to view your past purchases and track order deliveries."
          actionText="Sign In"
          actionLink="/login"
        />
      </div>
    );
  }

  const orders = Array.isArray(userOrder)
    ? userOrder
    : userOrder?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon="inventory_2"
          title="No Orders Found"
          description="You haven't placed any orders yet. Discover our latest technology products and place your first order today!"
          actionText="Start Shopping"
          actionLink="/shop"
        />
      </div>
    );
  }

  const orderStatuses = [
    "Confirmed",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const getStatusIndex = (currentStatus = "Confirmed") => {
    const idx = orderStatuses.findIndex(
      (s) => s.toLowerCase() === currentStatus.toLowerCase()
    );
    return idx > -1 ? idx : 0;
  };

  return (
    <div className="container py-5" style={{ minHeight: "85vh" }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-5">
        <div>
          <span
            className="text-uppercase fw-bold small text-primary"
            style={{ letterSpacing: "1px" }}
          >
            ORDER HISTORY
          </span>
          <h1 className="fw-bold text-dark mb-1">My Orders</h1>
          <p className="text-secondary mb-0">
            Track deliveries and manage receipts for your purchases.
          </p>
        </div>

        <Link to="/shop" className="btn btn-outline-dark rounded-pill px-4">
          <span className="material-symbols-outlined align-middle me-1">
            shopping_bag
          </span>
          Continue Shopping
        </Link>
      </div>

      {/* Orders List */}
      <div className="d-flex flex-column gap-4">
        {orders.map((order, index) => {
          const items = order?.orderItems || [];
          const shipping = order?.userShipping || {};
          const totalAmount = Number(order?.amount || 0);
          const orderId = order?.orderId || order?._id || `ORDER-${index + 1}`;
          const currentStatus = order?.orderStatus || "Confirmed";
          const statusIdx = getStatusIndex(currentStatus);
          const orderDate = order?.orderDate
            ? new Date(order.orderDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "Recent";

          return (
            <div
              key={order?._id || orderId}
              className="bg-white rounded-4 border border-light-subtle shadow-sm overflow-hidden"
              style={{ borderRadius: "20px" }}
            >
              {/* Order Card Header */}
              <div
                className="p-4 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-3"
                style={{ background: "#f8fafc" }}
              >
                <div>
                  <small className="text-secondary d-block">ORDER PLACED</small>
                  <strong className="text-dark">{orderDate}</strong>
                </div>

                <div>
                  <small className="text-secondary d-block">TOTAL AMOUNT</small>
                  <strong className="text-dark">{formatPrice(totalAmount)}</strong>
                </div>

                <div>
                  <small className="text-secondary d-block">SHIP TO</small>
                  <strong className="text-dark">{shipping?.fullName || "Recipient"}</strong>
                </div>

                <div>
                  <small className="text-secondary d-block">ORDER NUMBER</small>
                  <span className="badge bg-secondary-subtle text-dark font-monospace">
                    #{orderId}
                  </span>
                </div>

                <div>
                  <span
                    className={`badge rounded-pill px-3 py-2 ${
                      currentStatus.toLowerCase() === "delivered"
                        ? "bg-success-subtle text-success"
                        : "bg-primary-subtle text-primary"
                    }`}
                  >
                    ● {currentStatus}
                  </span>
                </div>
              </div>

              {/* Order Visual Timeline */}
              <div className="p-4 border-bottom bg-light-subtle">
                <div className="d-flex justify-content-between align-items-center position-relative">
                  {/* Timeline track bar */}
                  <div
                    className="position-absolute"
                    style={{
                      top: "14px",
                      left: "5%",
                      right: "5%",
                      height: "4px",
                      background: "#e2e8f0",
                      zIndex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: `${(statusIdx / (orderStatuses.length - 1)) * 100}%`,
                        height: "100%",
                        background: "#4f46e5",
                        transition: "width 0.4s ease",
                      }}
                    ></div>
                  </div>

                  {orderStatuses.map((step, idx) => {
                    const isCompleted = idx <= statusIdx;
                    return (
                      <div
                        key={step}
                        className="text-center position-relative"
                        style={{ zIndex: 2, flex: 1 }}
                      >
                        <div
                          className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                            isCompleted
                              ? "bg-primary text-white"
                              : "bg-white border text-secondary"
                          }`}
                          style={{ width: "28px", height: "28px", fontSize: "12px" }}
                        >
                          {isCompleted ? "✓" : idx + 1}
                        </div>
                        <span
                          className={`d-block small mt-2 ${
                            isCompleted ? "fw-bold text-dark" : "text-secondary"
                          }`}
                          style={{ fontSize: "11px" }}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <h6 className="fw-bold mb-3">Items in this shipment</h6>
                <div className="d-flex flex-column gap-3">
                  {items.map((item, idx) => (
                    <div
                      key={item._id || item.productId || idx}
                      className="d-flex align-items-center gap-3 pb-3 border-bottom last-border-0"
                    >
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        className="rounded-3 border"
                        style={{ width: "65px", height: "65px", objectFit: "contain" }}
                      />
                      <div className="flex-grow-1">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-dark fw-semibold text-decoration-none d-block mb-1 text-truncate"
                          style={{ maxWidth: "450px" }}
                        >
                          {item.title}
                        </Link>
                        <small className="text-secondary">
                          Quantity: {item.qty} | Price: {formatPrice(item.price)}
                        </small>
                      </div>
                      <Link
                        to={`/product/${item.productId}`}
                        className="btn btn-sm btn-outline-primary rounded-pill px-3"
                      >
                        Buy Again
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details Footer */}
              <div
                className="px-4 py-3 bg-light d-flex flex-wrap justify-content-between align-items-center gap-2 text-secondary small"
              >
                <div>
                  <strong>Delivery Address:</strong> {shipping?.address}, {shipping?.city},{" "}
                  {shipping?.state} - {shipping?.pincode}
                </div>
                <div>
                  Payment: <span className="text-success fw-bold">Verified (Razorpay)</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
