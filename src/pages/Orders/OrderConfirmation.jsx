
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AppContext from "../../context/AppContext";
//import ShowOrderProduct from "../../components/ShowOrderProduct";
import ProductCard from "../../components/product/ProductCard";

const OrderConfirmation = () => {
  const { userOrder } = useContext(AppContext);

  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    if (userOrder && userOrder.length > 0) {
      setLatestOrder(userOrder[0]);
    }
  }, [userOrder]);

  // Loading state
  if (!latestOrder) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center flex-column py-5">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          ></div>

          <h5 className="fw-semibold">Loading your order...</h5>
          <p className="text-secondary mb-0">
            Please wait while we fetch your order details.
          </p>
        </div>
      </div>
    );
  }

  const shipping = latestOrder?.userShipping || {};

  const details = [
    {
      label: "Order ID",
      value: latestOrder?.orderId,
      icon: "receipt_long",
    },
    {
      label: "Payment ID",
      value: latestOrder?.paymentId,
      icon: "payments",
    },
    {
      label: "Payment Status",
      value: latestOrder?.payStatus,
      icon: "verified",
    },
  ];

  const addressFields = [
    {
      label: "Full Name",
      value: shipping?.fullName,
      icon: "person",
    },
    {
      label: "Phone",
      value: shipping?.phoneNumber,
      icon: "phone",
    },
    {
      label: "Country",
      value: shipping?.country,
      icon: "public",
    },
    {
      label: "State",
      value: shipping?.state,
      icon: "map",
    },
    {
      label: "Pincode",
      value: shipping?.pincode,
      icon: "location_on",
    },
    {
      label: "Address",
      value: shipping?.address,
      icon: "home",
    },
  ];

  return (
    <div
      className="container-fluid py-5"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f8fafc 100%)",
      }}
    >
      <div className="container" style={{ maxWidth: "1100px" }}>

        {/* ================= SUCCESS HEADER ================= */}
        <div className="text-center mb-5">

          <div
            className="mx-auto mb-4 d-flex justify-content-center align-items-center"
            style={{
              width: "85px",
              height: "85px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 15px 35px rgba(34,197,94,0.25)",
            }}
          >
            <span
              className="material-symbols-outlined text-white"
              style={{
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              check
            </span>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              color: "#111827",
            }}
          >
            Order Confirmed!
          </h1>

          <p
            className="text-secondary mb-4"
            style={{ fontSize: "16px" }}
          >
            Thank you for shopping with us. Your order has been placed
            successfully.
          </p>

          {/* Order ID */}
          {latestOrder?.orderId && (
            <div className="d-flex justify-content-center">
              <div
                className="px-4 py-2 rounded-pill fw-semibold"
                style={{
                  background: "#eef2ff",
                  color: "#4f46e5",
                  border: "1px solid #c7d2fe",
                }}
              >
                <span className="material-symbols-outlined align-middle me-2">
                  receipt_long
                </span>

                Order #{latestOrder.orderId}
              </div>
            </div>
          )}
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="row g-4">

          {/* ================= ORDER ITEMS ================= */}
          <div className="col-lg-7">

            <div
              className="bg-white rounded-4 overflow-hidden h-100"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 40px rgba(15,23,42,0.07)",
              }}
            >

              {/* Header */}
              <div
                className="p-4 d-flex justify-content-between align-items-center"
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <h4 className="fw-bold mb-1 text-dark">
                    Your Order
                  </h4>

                  <p className="text-secondary mb-0 small">
                    Items included in your order
                  </p>
                </div>

                <div
                  className="rounded-circle d-flex justify-content-center align-items-center"
                  style={{
                    width: "45px",
                    height: "45px",
                    background: "#eef2ff",
                    color: "#4f46e5",
                  }}
                >
                  <span className="material-symbols-outlined">
                    shopping_bag
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <ProductCard
                  items={latestOrder?.orderItems}
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="col-lg-5">

            {/* Order Details */}
            <div
              className="bg-white rounded-4 overflow-hidden mb-4"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 40px rgba(15,23,42,0.07)",
              }}
            >

              <div
                className="p-4"
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <h4 className="fw-bold mb-1">
                  Order Details
                </h4>

                <p className="text-secondary small mb-0">
                  Payment and order information
                </p>
              </div>

              <div className="p-4">

                {details.map(
                  (item) =>
                    item.value && (
                      <div
                        key={item.label}
                        className="d-flex align-items-center mb-3"
                      >

                        <div
                          className="rounded-3 d-flex justify-content-center align-items-center me-3"
                          style={{
                            width: "40px",
                            height: "40px",
                            background: "#f1f5f9",
                            color: "#4f46e5",
                          }}
                        >
                          <span className="material-symbols-outlined">
                            {item.icon}
                          </span>
                        </div>

                        <div className="flex-grow-1">
                          <div className="text-secondary small">
                            {item.label}
                          </div>

                          <div
                            className="fw-semibold text-dark"
                            style={{
                              wordBreak: "break-word",
                            }}
                          >
                            {item.value}
                          </div>
                        </div>

                      </div>
                    )
                )}

              </div>
            </div>

            {/* ================= SHIPPING ADDRESS ================= */}
            <div
              className="bg-white rounded-4 overflow-hidden"
              style={{
                border: "1px solid #e5e7eb",
                boxShadow: "0 15px 40px rgba(15,23,42,0.07)",
              }}
            >

              <div
                className="p-4"
                style={{
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div className="d-flex align-items-center">

                  <div
                    className="rounded-3 d-flex justify-content-center align-items-center me-3"
                    style={{
                      width: "45px",
                      height: "45px",
                      background: "#ecfdf5",
                      color: "#16a34a",
                    }}
                  >
                    <span className="material-symbols-outlined">
                      local_shipping
                    </span>
                  </div>

                  <div>
                    <h4 className="fw-bold mb-1">
                      Delivery Address
                    </h4>

                    <p className="text-secondary small mb-0">
                      Your order will be delivered here
                    </p>
                  </div>

                </div>
              </div>

              <div className="p-4">

                {addressFields.map(
                  (item) =>
                    item.value && (
                      <div
                        key={item.label}
                        className="d-flex align-items-start mb-3"
                      >

                        <span
                          className="material-symbols-outlined me-3"
                          style={{
                            color: "#6366f1",
                            fontSize: "21px",
                          }}
                        >
                          {item.icon}
                        </span>

                        <div>
                          <div className="text-secondary small">
                            {item.label}
                          </div>

                          <div className="fw-semibold text-dark">
                            {item.value}
                          </div>
                        </div>

                      </div>
                    )
                )}

              </div>
            </div>

          </div>
        </div>

        {/* ================= SUCCESS MESSAGE ================= */}
        <div
          className="bg-white rounded-4 mt-4 p-4 text-center"
          style={{
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
          }}
        >
          <div
            className="d-inline-flex justify-content-center align-items-center rounded-circle mb-3"
            style={{
              width: "45px",
              height: "45px",
              background: "#ecfdf5",
              color: "#16a34a",
            }}
          >
            <span className="material-symbols-outlined">
              local_shipping
            </span>
          </div>

          <h5 className="fw-bold">
            Your order is on its way!
          </h5>

          <p className="text-secondary mb-0">
            We will process your order and deliver it to your
            provided address.
          </p>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="d-flex flex-column flex-sm-row justify-content-center gap-3 mt-5">

          <Link
            to="/shop"
            className="btn btn-lg rounded-3 px-4 fw-semibold"
            style={{
              background: "white",
              border: "1px solid #d1d5db",
              color: "#374151",
            }}
          >
            <span className="material-symbols-outlined align-middle me-2">
              shopping_bag
            </span>

            Continue Shopping
          </Link>

          <Link
            to="/orders"
            className="btn btn-lg rounded-3 px-4 fw-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, #6366f1, #4f46e5)",
              border: "none",
              boxShadow: "0 10px 25px rgba(79,70,229,0.25)",
            }}
          >
            <span className="material-symbols-outlined align-middle me-2">
              inventory_2
            </span>

            View My Orders
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;

