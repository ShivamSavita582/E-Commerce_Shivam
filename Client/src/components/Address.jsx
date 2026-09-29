
import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const { shippingAddress, userAddress } = useContext(AppContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNumber: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const {
      fullName,
      address,
      city,
      state,
      country,
      pincode,
      phoneNumber,
    } = formData;

    // Basic validation
    if (
      !fullName ||
      !address ||
      !city ||
      !state ||
      !country ||
      !pincode ||
      !phoneNumber
    ) {
      alert("Please fill all the required fields.");
      return;
    }

    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    if (phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const result = await shippingAddress(
        fullName,
        address,
        city,
        state,
        country,
        pincode,
        phoneNumber
      );

      if (result?.success) {
        setFormData({
          fullName: "",
          address: "",
          city: "",
          state: "",
          country: "",
          pincode: "",
          phoneNumber: "",
        });

        navigate("/checkout");
      }
    } catch (error) {
      console.error("Address submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container py-5"
      style={{
        minHeight: "calc(100vh - 80px)",
      }}
    >
      {/* Header */}
      <div className="text-center mb-5">
        <div
          className="d-inline-flex align-items-center justify-content-center mb-3"
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg, #4f46e5, #7c3aed)",
            boxShadow: "0 12px 30px rgba(79,70,229,0.3)",
          }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: "32px" }}
          >
            location_on
          </span>
        </div>

        <p className="text-primary fw-semibold mb-2">
          CHECKOUT
        </p>

        <h1 className="text-white fw-bold mb-2">
          Shipping Address
        </h1>

        <p className="text-secondary mb-0">
          Where should we deliver your order?
        </p>
      </div>

      {/* Main Card */}
      <div
        className="mx-auto p-3 p-md-5"
        style={{
          maxWidth: "1000px",
          borderRadius: "28px",
          background:
            "linear-gradient(145deg, #111827, #1f2937)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
        }}
      >
        <form onSubmit={submitHandler}>

          {/* Section Header */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "rgba(79,70,229,0.15)",
              }}
            >
              <span className="material-symbols-outlined text-primary">
                person
              </span>
            </div>

            <div>
              <h5 className="text-white fw-bold mb-0">
                Personal Information
              </h5>

              <small className="text-secondary">
                Enter your delivery details
              </small>
            </div>
          </div>

          {/* Personal Information */}
          <div className="row g-4">

            {/* Full Name */}
            <div className="col-md-6">
              <label
                htmlFor="fullName"
                className="form-label text-light fw-semibold"
              >
                Full Name
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  person
                </span>

                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChangeHandler}
                  placeholder="Enter your full name"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label
                htmlFor="phoneNumber"
                className="form-label text-light fw-semibold"
              >
                Phone Number
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  phone
                </span>

                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChangeHandler}
                  placeholder="10-digit phone number"
                  maxLength="10"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* Country */}
            <div className="col-md-4">
              <label
                htmlFor="country"
                className="form-label text-light fw-semibold"
              >
                Country
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  public
                </span>

                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  placeholder="India"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* State */}
            <div className="col-md-4">
              <label
                htmlFor="state"
                className="form-label text-light fw-semibold"
              >
                State
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  map
                </span>

                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={onChangeHandler}
                  placeholder="Enter state"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* City */}
            <div className="col-md-4">
              <label
                htmlFor="city"
                className="form-label text-light fw-semibold"
              >
                City
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  location_city
                </span>

                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={onChangeHandler}
                  placeholder="Enter city"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="col-md-4">
              <label
                htmlFor="pincode"
                className="form-label text-light fw-semibold"
              >
                Pincode
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  pin
                </span>

                <input
                  type="tel"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={onChangeHandler}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    height: "52px",
                    paddingLeft: "48px",
                    borderRadius: "14px",
                  }}
                />
              </div>
            </div>

            {/* Address */}
            <div className="col-12">
              <label
                htmlFor="address"
                className="form-label text-light fw-semibold"
              >
                Complete Address
              </label>

              <div className="position-relative">
                <span
                  className="material-symbols-outlined position-absolute text-secondary"
                  style={{
                    left: "15px",
                    top: "17px",
                  }}
                >
                  home
                </span>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={onChangeHandler}
                  placeholder="House no., street, area, landmark..."
                  rows="4"
                  className="form-control bg-dark text-white border-secondary"
                  style={{
                    paddingLeft: "48px",
                    paddingTop: "14px",
                    borderRadius: "14px",
                    resize: "none",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div
            className="d-flex align-items-start gap-3 mt-4 p-3"
            style={{
              borderRadius: "14px",
              background: "rgba(34,197,94,0.07)",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <span className="material-symbols-outlined text-success">
              verified_user
            </span>

            <div>
              <p className="text-white fw-semibold mb-1">
                Your information is secure
              </p>

              <small className="text-secondary">
                Your shipping information is securely used only
                for order delivery.
              </small>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-3 rounded-3 fw-bold"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Saving Address...
                </>
              ) : (
                <>
                  Save Address & Continue
                  <span className="material-symbols-outlined align-middle ms-2">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Existing Address */}
        {userAddress && (
          <div className="mt-5">

            <div
              className="d-flex align-items-center gap-3 mb-3"
            >
              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  flex: 1,
                }}
              />

              <span className="text-secondary small">
                OR
              </span>

              <div
                style={{
                  height: "1px",
                  background: "rgba(255,255,255,0.1)",
                  flex: 1,
                }}
              />
            </div>

            <div
              className="p-4"
              style={{
                borderRadius: "18px",
                background:
                  "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(251,191,36,0.03))",
                border:
                  "1px solid rgba(245,158,11,0.2)",
              }}
            >
              <div className="d-flex align-items-start gap-3">

                <div
                  className="d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "14px",
                    background:
                      "rgba(245,158,11,0.12)",
                  }}
                >
                  <span className="material-symbols-outlined text-warning">
                    history
                  </span>
                </div>

                <div className="flex-grow-1">
                  <h5 className="text-white fw-bold mb-1">
                    Use Saved Address
                  </h5>

                  <p className="text-secondary small mb-3">
                    You already have a saved shipping address.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/checkout")}
                    className="btn btn-warning rounded-pill px-4 fw-semibold"
                  >
                    Use Old Address
                    <span className="material-symbols-outlined align-middle ms-2">
                      arrow_forward
                    </span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;

