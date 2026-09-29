import React from "react";
import { Link } from "react-router-dom";

const EmptyState = ({
  icon = "sentiment_dissatisfied",
  title = "No Items Found",
  description = "We couldn't find what you were looking for.",
  actionText = "Explore Shop",
  actionLink = "/shop",
  onAction,
}) => {
  return (
    <div className="text-center py-5 px-3 my-4">
      <div
        className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
        style={{
          width: "90px",
          height: "90px",
          background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
          color: "#4f46e5",
          boxShadow: "0 10px 25px rgba(79, 70, 229, 0.1)",
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: "44px" }}>
          {icon}
        </span>
      </div>
      <h3 className="fw-bold mb-2 text-dark">{title}</h3>
      <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: "460px" }}>
        {description}
      </p>
      {actionText && (
        <div>
          {onAction ? (
            <button
              onClick={onAction}
              className="btn btn-primary px-4 py-2 rounded-pill fw-semibold"
            >
              {actionText}
            </button>
          ) : (
            <Link
              to={actionLink}
              className="btn btn-primary px-4 py-2 rounded-pill fw-semibold text-decoration-none"
            >
              {actionText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
