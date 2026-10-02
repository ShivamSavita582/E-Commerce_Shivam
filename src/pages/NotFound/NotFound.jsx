import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center text-center py-5"
      style={{ minHeight: "75vh" }}
    >
      <div
        className="rounded-circle d-flex align-items-center justify-content-center mb-4"
        style={{
          width: "120px",
          height: "120px",
          background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
          color: "#4f46e5",
          fontSize: "48px",
          fontWeight: "800",
        }}
      >
        404
      </div>
      <h1 className="fw-bold mb-2 text-dark">Page Not Found</h1>
      <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "450px" }}>
        Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <div className="d-flex gap-3">
        <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
          Return Home
        </Link>
        <Link to="/shop" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-semibold">
          Explore Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
