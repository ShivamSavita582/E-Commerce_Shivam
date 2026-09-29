import React, { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loadingAuth, logout } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (loadingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking privileges...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict Admin Only Check
  if (user?.role !== "admin") {
    const handleSwitchToAdmin = () => {
      if (logout) logout();
      navigate("/login", { state: { from: location } });
    };

    return (
      <div className="container py-5 text-center d-flex align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
        <div className="card shadow-lg border-0 rounded-4 p-4 p-md-5 mx-auto" style={{ maxWidth: "520px", background: "#ffffff" }}>
          <div className="mb-3 d-inline-flex p-3 rounded-circle bg-danger-subtle text-danger mx-auto">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "52px" }}
            >
              gpp_bad
            </span>
          </div>

          <span className="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill mx-auto mb-2 fw-bold" style={{ fontSize: "11px", letterSpacing: "1px" }}>
            403 • ACCESS FORBIDDEN
          </span>

          <h2 className="fw-bold mb-2 text-dark">Admin Access Restricted</h2>
          
          <p className="text-secondary mb-3" style={{ fontSize: "14px", lineHeight: "1.7" }}>
            The Store Management Console is strictly restricted to authorized administrators. Normal customer accounts do not have access to inventory, orders, or support logs.
          </p>

          <div className="p-3 bg-light rounded-3 text-start mb-4 border">
            <small className="text-secondary d-block">CURRENT SESSION:</small>
            <div className="d-flex justify-content-between align-items-center mt-1">
              <strong className="text-dark">{user?.name || "Customer"}</strong>
              <span className="badge bg-secondary text-uppercase">{user?.role || "user"}</span>
            </div>
            <small className="text-muted d-block">{user?.email}</small>
          </div>

          <div className="d-flex flex-column gap-2">
            <button
              onClick={handleSwitchToAdmin}
              className="btn btn-dark rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                login
              </span>
              <span>Sign in with Admin Credentials</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline-secondary rounded-pill py-2 fw-semibold"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

