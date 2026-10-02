import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { formatPrice } from "../../utils/formatCurrency";
import { notify } from "../../utils/notification";
import "./Profile.css";

const Profile = () => {
  const {
    user,
    cart,
    wishlist,
    userOrder,
    userAddress,
    logout,
    updateUserProfile,
    shippingAddress,
  } = useContext(AppContext);

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Edit State
  const [editingAddress, setEditingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: userAddress?.fullName || user?.name || "",
    phoneNumber: userAddress?.phoneNumber || "",
    country: userAddress?.country || "India",
    state: userAddress?.state || "",
    city: userAddress?.city || "",
    pincode: userAddress?.pincode || "",
    address: userAddress?.address || "",
  });

  const userName = user?.name || "Member";
  const userEmail = user?.email || "customer@store.com";
  const userRole = user?.role || "user";
  const avatarLetter = userName.charAt(0).toUpperCase();

  const orders = Array.isArray(userOrder) ? userOrder : userOrder?.orders || [];
  const wishlistItems = wishlist?.products || [];

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      notify.warning("Name cannot be empty");
      return;
    }
    try {
      setSavingProfile(true);
      await updateUserProfile({ name: name.trim(), phone: phone.trim() });
      setEditingProfile(false);
    } catch {
      // Error handled in context
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      await shippingAddress(
        addressForm.fullName,
        addressForm.address,
        addressForm.city,
        addressForm.state,
        addressForm.country,
        addressForm.pincode,
        addressForm.phoneNumber
      );
      setEditingAddress(false);
    } catch {
      // Error handled in context
    }
  };

  return (
    <main className="profile-page">
      {/* Profile Hero Header */}
      <section className="profile-hero">
        <div className="profile-hero-content">
          <div className="profile-avatar">{avatarLetter}</div>
          <div className="profile-intro">
            <span className="profile-label">ACCOUNT DASHBOARD</span>
            <h1>Welcome, {userName.split(" ")[0]}!</h1>
            <p className="text-secondary mb-0">
              Manage your profile, tracked orders, wishlist items and saved addresses.
            </p>
          </div>
        </div>
      </section>

      <section className="profile-container">
        {/* Quick Stats Grid */}
        <div className="profile-stats">
          <div className="stat-card" onClick={() => setActiveTab("orders")} style={{ cursor: "pointer" }}>
            <div className="stat-icon">
              <span className="material-symbols-outlined">receipt_long</span>
            </div>
            <div>
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>

          <Link to="/cart" className="stat-card text-decoration-none">
            <div className="stat-icon">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <div>
              <span className="stat-number">{cart?.items?.length || 0}</span>
              <span className="stat-label">Cart Items</span>
            </div>
          </Link>

          <div className="stat-card" onClick={() => setActiveTab("wishlist")} style={{ cursor: "pointer" }}>
            <div className="stat-icon" style={{ color: "#ef4444" }}>
              <span className="material-symbols-outlined">favorite</span>
            </div>
            <div>
              <span className="stat-number">{wishlistItems.length}</span>
              <span className="stat-label">Wishlist</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="d-flex gap-2 my-4 border-bottom pb-2 overflow-auto">
          {[
            { id: "profile", label: "Profile Information", icon: "person" },
            { id: "orders", label: `My Orders (${orders.length})`, icon: "receipt_long" },
            { id: "wishlist", label: `Wishlist (${wishlistItems.length})`, icon: "favorite" },
            { id: "address", label: "Saved Address", icon: "location_on" },
            { id: "security", label: "Security & Role", icon: "security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 py-2 fw-semibold ${
                activeTab === tab.id ? "btn-dark text-white" : "btn-light text-secondary"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === "profile" && (
          <div className="profile-main-card">
            <div className="card-heading">
              <div>
                <span className="section-eyebrow">PERSONAL DETAILS</span>
                <h2>Account Information</h2>
              </div>
              <button
                className="edit-profile-btn"
                onClick={() => setEditingProfile(!editingProfile)}
              >
                <span className="material-symbols-outlined">
                  {editingProfile ? "close" : "edit"}
                </span>
                {editingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editingProfile ? (
              <form onSubmit={handleProfileSubmit} className="mt-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary px-4 rounded-pill fw-semibold"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <span className="info-label">Full Name</span>
                    <strong>{userName}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div>
                    <span className="info-label">Email Address</span>
                    <strong>{userEmail}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <div>
                    <span className="info-label">Phone Number</span>
                    <strong>{user?.phone || phone || "Not set"}</strong>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <span className="info-label">Account Role</span>
                    <strong className="text-capitalize text-primary">{userRole}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === "orders" && (
          <div className="profile-main-card">
            <div className="card-heading">
              <div>
                <span className="section-eyebrow">HISTORY</span>
                <h2>Recent Orders</h2>
              </div>
              <Link to="/orders" className="btn btn-outline-primary btn-sm rounded-pill px-3">
                Full Orders View
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-secondary py-4 text-center">
                You haven't placed any orders yet.
              </p>
            ) : (
              <div className="d-flex flex-column gap-3 mt-3">
                {orders.slice(0, 5).map((ord, i) => (
                  <div
                    key={ord._id || i}
                    className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center flex-wrap gap-2"
                  >
                    <div>
                      <strong>Order #{ord.orderId || ord._id}</strong>
                      <small className="text-secondary d-block">
                        {ord.orderItems?.length || 1} items • {formatPrice(ord.amount)}
                      </small>
                    </div>
                    <span className="badge bg-primary-subtle text-primary">
                      {ord.orderStatus || "Confirmed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Wishlist */}
        {activeTab === "wishlist" && (
          <div className="profile-main-card">
            <div className="card-heading">
              <div>
                <span className="section-eyebrow">FAVORITES</span>
                <h2>Saved In Wishlist</h2>
              </div>
              <Link to="/wishlist" className="btn btn-outline-danger btn-sm rounded-pill px-3">
                Open Wishlist
              </Link>
            </div>

            {wishlistItems.length === 0 ? (
              <p className="text-secondary py-4 text-center">
                Your wishlist is empty.
              </p>
            ) : (
              <div className="row g-3 mt-2">
                {wishlistItems.slice(0, 4).map((item) => {
                  const prod = item.productId;
                  if (!prod) return null;
                  return (
                    <div key={item._id || prod._id} className="col-6 col-md-3">
                      <div className="p-3 bg-light rounded-3 text-center h-100">
                        <img
                          src={prod.imgSrc}
                          alt={prod.title}
                          style={{ height: "90px", objectFit: "contain" }}
                          className="mb-2 img-fluid"
                        />
                        <h6 className="small fw-semibold text-truncate mb-1">{prod.title}</h6>
                        <span className="text-primary fw-bold small">{formatPrice(prod.price)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Address */}
        {activeTab === "address" && (
          <div className="profile-main-card">
            <div className="card-heading">
              <div>
                <span className="section-eyebrow">SHIPPING</span>
                <h2>Default Delivery Address</h2>
              </div>
              <button
                onClick={() => setEditingAddress(!editingAddress)}
                className="btn btn-outline-dark btn-sm rounded-pill px-3"
              >
                {editingAddress ? "Cancel" : userAddress ? "Edit Address" : "Add Address"}
              </button>
            </div>

            {editingAddress ? (
              <form onSubmit={handleAddressSubmit} className="mt-4">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.fullName}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={addressForm.phoneNumber}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, phoneNumber: e.target.value })
                      }
                      maxLength="10"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Street Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={addressForm.address}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, address: e.target.value })
                      }
                      required
                    ></textarea>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.state}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, state: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={addressForm.pincode}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, pincode: e.target.value })
                      }
                      maxLength="6"
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary px-4 rounded-pill fw-semibold mt-4">
                  Save Address
                </button>
              </form>
            ) : userAddress ? (
              <div className="p-4 bg-light rounded-4 mt-3">
                <h5 className="fw-bold mb-2">{userAddress.fullName}</h5>
                <p className="text-secondary mb-1">
                  {userAddress.address}, {userAddress.city}, {userAddress.state} -{" "}
                  {userAddress.pincode}
                </p>
                <small className="text-secondary d-block">
                  Phone: {userAddress.phoneNumber} | Country: {userAddress.country}
                </small>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-secondary">No shipping address saved yet.</p>
                <button
                  onClick={() => setEditingAddress(true)}
                  className="btn btn-primary rounded-pill px-4"
                >
                  Add Address Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === "security" && (
          <div className="profile-main-card">
            <div className="card-heading">
              <div>
                <span className="section-eyebrow">PROTECTION</span>
                <h2>Account Security</h2>
              </div>
            </div>

            <div className="d-flex flex-column gap-3 mt-3">
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong>Password & Authentication</strong>
                  <small className="text-secondary d-block">
                    Your password is encrypted with Bcrypt 10-round salt.
                  </small>
                </div>
                <span className="badge bg-success-subtle text-success">Protected</span>
              </div>

              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <strong>Session Status</strong>
                  <small className="text-secondary d-block">
                    JWT Session Token active with 365-day expiry.
                  </small>
                </div>
                <span className="badge bg-primary-subtle text-primary">Active</span>
              </div>
            </div>
          </div>
        )}

        {/* Sign Out Card */}
        <div className="profile-logout mt-5">
          <div>
            <h3>Sign out from account</h3>
            <p>You can securely sign out from this device whenever you are finished.</p>
          </div>
          <button onClick={logout} className="logout-profile-btn">
            <span className="material-symbols-outlined">logout</span>
            Sign Out
          </button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
