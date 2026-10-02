import React from "react";

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  const sizeMap = {
    sm: "24px",
    md: "40px",
    lg: "60px",
  };

  const dimension = sizeMap[size] || sizeMap.md;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div
        className="spinner-border text-primary mb-3"
        role="status"
        style={{ width: dimension, height: dimension }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="text-secondary small fw-medium mb-0">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
