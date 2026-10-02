import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { orderService } from "../../services/orderService";
import { formatPrice } from "../../utils/formatCurrency";
import { notify } from "../../utils/notification";

const CheckoutPage = () => {
  const {
    cart,
    userAddress,
    shippingAddress,
    user,
    clearCart,
    appliedCoupon,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // Multi-step states: 1 = Address, 2 = Order Review, 3 = Payment
  const [currentStep, setCurrentStep] = useState(userAddress ? 2 : 1);
  const [loading, setLoading] = useState(false);

  // Address form state
  const [addressData, setAddressData] = useState({
    fullName: userAddress?.fullName || user?.name || "",
    phoneNumber: userAddress?.phoneNumber || user?.phone || "",
    country: userAddress?.country || "India",
    state: userAddress?.state || "",
    city: userAddress?.city || "",
    pincode: userAddress?.pincode || "",
    address: userAddress?.address || "",
  });

  const items = cart?.items || [];

  // Totals calculation
  const subtotal = items.reduce(
    (total, item) => total + Number(item.price || 0),
    0
  );
  const totalQty = items.reduce(
    (total, item) => total + Number(item.qty || 0),
    0
  );
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discount = appliedCoupon?.discountAmount || 0;
  const tax = Math.round(subtotal * 0.05);
  const grandTotal = Math.max(0, subtotal + shipping + tax - discount);

  // Sync address if loaded later
  useEffect(() => {
    if (userAddress) {
      setAddressData({
        fullName: userAddress.fullName || "",
        phoneNumber: userAddress.phoneNumber || "",
        country: userAddress.country || "India",
        state: userAddress.state || "",
        city: userAddress.city || "",
        pincode: userAddress.pincode || "",
        address: userAddress.address || "",
      });
    }
  }, [userAddress]);

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const { fullName, address, city, state, country, pincode, phoneNumber } =
      addressData;

    if (!fullName || !address || !city || !state || !country || !pincode || !phoneNumber) {
      notify.warning("Please fill all required shipping fields");
      return;
    }
    if (pincode.toString().length !== 6) {
      notify.warning("Please provide a valid 6-digit postal code");
      return;
    }

    try {
      setLoading(true);
      await shippingAddress(
        fullName,
        address,
        city,
        state,
        country,
        pincode,
        phoneNumber
      );
      setCurrentStep(2);
    } catch {
      // Error handled in context
    } finally {
      setLoading(false);
    }
  };

  // Payment Handler
  const handlePayment = async () => {
    if (!items.length) {
      notify.warning("Your cart is empty");
      navigate("/shop");
      return;
    }

    if (!userAddress && !addressData.address) {
      notify.warning("Please provide delivery address");
      setCurrentStep(1);
      return;
    }

    try {
      setLoading(true);

      // Create Razorpay order on backend
      const orderResponse = await orderService.createCheckout({
        amount: grandTotal,
        cartItems: items,
        userShipping: userAddress || addressData,
        userId: user?._id || "guest",
      });

      const { orderId, amount: orderAmount } = orderResponse;

      const options = {
        key: "rzp_test_SKj75OJp54Vz8m",
        amount: orderAmount * 100,
        currency: "INR",
        name: "MERN Store",
        description: `Order #${orderId || Date.now()}`,
        image: "",
        order_id: orderId,
        handler: async function (response) {
          try {
            const verificationPayload = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: grandTotal,
              orderItems: items,
              userId: user?._id || "guest",
              userShipping: userAddress || addressData,
            };

            const confirmRes = await orderService.verifyPayment(
              verificationPayload
            );

            if (confirmRes.success) {
              await clearCart();
              notify.success("Order confirmed successfully!");
              navigate("/orderconfirmation");
            }
          } catch (err) {
            console.error("Verification error:", err);
            notify.error("Payment confirmation failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || addressData.fullName,
          email: user?.email || "",
          contact: addressData.phoneNumber,
        },
        theme: {
          color: "#4f46e5",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      if (!window.Razorpay) {
        notify.error("Payment gateway script not loaded. Refresh page.");
        setLoading(false);
        return;
      }

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      notify.error(error?.response?.data?.message || "Payment initialization failed.");
      setLoading(false);
    }
  };

  if (!items.length) {
    return (
      <div className="container py-5 text-center" style={{ minHeight: "60vh" }}>
        <h2 className="fw-bold mb-3">No Items to Checkout</h2>
        <p className="text-secondary mb-4">
          Your cart is currently empty. Add products to proceed to checkout.
        </p>
        <Link to="/shop" className="btn btn-primary rounded-pill px-4">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ minHeight: "85vh" }}>
      {/* Progress Stepper */}
      <div className="mb-5">
        <div className="d-flex justify-content-center align-items-center gap-2 gap-md-4">
          {/* Step 1 */}
          <div
            className={`d-flex align-items-center gap-2 cursor-pointer ${
              currentStep === 1
                ? "text-primary fw-bold"
                : currentStep > 1
                ? "text-success fw-bold"
                : "text-secondary"
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <span
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                currentStep === 1
                  ? "bg-primary text-white"
                  : currentStep > 1
                  ? "bg-success text-white"
                  : "bg-light text-secondary"
              }`}
              style={{ width: "32px", height: "32px", fontSize: "14px" }}
            >
              {currentStep > 1 ? "✓" : "1"}
            </span>
            <span>Shipping</span>
          </div>

          <div style={{ width: "40px", height: "2px", background: "#e2e8f0" }}></div>

          {/* Step 2 */}
          <div
            className={`d-flex align-items-center gap-2 cursor-pointer ${
              currentStep === 2
                ? "text-primary fw-bold"
                : currentStep > 2
                ? "text-success fw-bold"
                : "text-secondary"
            }`}
            onClick={() => userAddress && setCurrentStep(2)}
          >
            <span
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                currentStep === 2
                  ? "bg-primary text-white"
                  : currentStep > 2
                  ? "bg-success text-white"
                  : "bg-light text-secondary"
              }`}
              style={{ width: "32px", height: "32px", fontSize: "14px" }}
            >
              {currentStep > 2 ? "✓" : "2"}
            </span>
            <span>Order Summary</span>
          </div>

          <div style={{ width: "40px", height: "2px", background: "#e2e8f0" }}></div>

          {/* Step 3 */}
          <div
            className={`d-flex align-items-center gap-2 ${
              currentStep === 3 ? "text-primary fw-bold" : "text-secondary"
            }`}
          >
            <span
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                currentStep === 3
                  ? "bg-primary text-white"
                  : "bg-light text-secondary"
              }`}
              style={{ width: "32px", height: "32px", fontSize: "14px" }}
            >
              3
            </span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Step 1: Address Form */}
        {currentStep === 1 && (
          <div className="col-lg-8 mx-auto">
            <div className="p-4 bg-white rounded-4 border border-light-subtle shadow-sm">
              <h4 className="fw-bold mb-3">Delivery Information</h4>
              <form onSubmit={handleSaveAddress}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      value={addressData.fullName}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      className="form-control"
                      value={addressData.phoneNumber}
                      onChange={handleAddressChange}
                      maxLength="10"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address</label>
                    <textarea
                      name="address"
                      className="form-control"
                      rows="2"
                      value={addressData.address}
                      onChange={handleAddressChange}
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      value={addressData.city}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-control"
                      value={addressData.state}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Postal Code (PIN)</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-control"
                      value={addressData.pincode}
                      onChange={handleAddressChange}
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 d-flex justify-content-end gap-3">
                  <Link to="/cart" className="btn btn-outline-secondary px-4 rounded-pill">
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary px-5 rounded-pill fw-semibold"
                  >
                    {loading ? "Saving..." : "Continue to Summary →"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 2 & 3: Order Summary & Review & Pay */}
        {currentStep >= 2 && (
          <>
            {/* Left: Items list & Delivery address review */}
            <div className="col-lg-7">
              <div className="p-4 bg-white rounded-4 border border-light-subtle shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Delivery Address</h5>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="btn btn-link text-primary text-decoration-none p-0 small fw-semibold"
                  >
                    Change
                  </button>
                </div>
                <div className="p-3 bg-light rounded-3">
                  <strong className="d-block text-dark">
                    {userAddress?.fullName || addressData.fullName}
                  </strong>
                  <p className="text-secondary small mb-1">
                    {userAddress?.address || addressData.address},{" "}
                    {userAddress?.city || addressData.city},{" "}
                    {userAddress?.state || addressData.state} -{" "}
                    {userAddress?.pincode || addressData.pincode}
                  </p>
                  <small className="text-secondary">
                    Phone: {userAddress?.phoneNumber || addressData.phoneNumber}
                  </small>
                </div>
              </div>

              <div className="p-4 bg-white rounded-4 border border-light-subtle shadow-sm">
                <h5 className="fw-bold mb-3">Order Items ({totalQty})</h5>
                <div className="d-flex flex-column gap-3">
                  {items.map((item) => (
                    <div
                      key={item._id || item.productId}
                      className="d-flex align-items-center gap-3 pb-3 border-bottom"
                    >
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        className="rounded-3"
                        style={{ width: "60px", height: "60px", objectFit: "contain" }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0 text-dark fw-semibold text-truncate" style={{ maxWidth: "300px" }}>
                          {item.title}
                        </h6>
                        <small className="text-secondary">Qty: {item.qty}</small>
                      </div>
                      <div className="fw-bold text-dark">{formatPrice(item.price)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Price calculation & Proceed to Pay button */}
            <div className="col-lg-5">
              <div className="p-4 bg-white rounded-4 border border-light-subtle shadow-sm sticky-top" style={{ top: "90px" }}>
                <h5 className="fw-bold mb-4">Payment Summary</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Items Total</span>
                  <span className="fw-semibold text-dark">{formatPrice(subtotal)}</span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Delivery</span>
                  <span className={shipping === 0 ? "text-success fw-bold" : "fw-semibold"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Tax (5% GST)</span>
                  <span className="fw-semibold text-dark">{formatPrice(tax)}</span>
                </div>

                {discount > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Discount Coupon</span>
                    <span className="fw-bold">- {formatPrice(discount)}</span>
                  </div>
                )}

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5 text-dark">Total Payable</span>
                  <span className="fw-bold fs-4 text-primary">{formatPrice(grandTotal)}</span>
                </div>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handlePayment}
                  className="btn btn-primary w-100 py-3 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                >
                  {loading ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">lock</span>
                      Pay with Razorpay ({formatPrice(grandTotal)})
                    </>
                  )}
                </button>

                <div className="text-center mt-3 text-secondary small">
                  🔒 Secured 256-bit Encrypted Transaction
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
