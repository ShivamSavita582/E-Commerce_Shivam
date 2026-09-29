import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AppContext from "../../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useContext(AppContext);
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
