import React from "react";

const ProductSkeleton = ({ count = 4 }) => {
  return (
    <div className="row g-4 w-100">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-3">
          <div
            className="p-3 rounded-4 bg-white border border-light-subtle h-100 placeholder-glow"
            style={{
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
              minHeight: "360px",
            }}
          >
            <div
              className="placeholder w-100 rounded-3 mb-3"
              style={{ height: "200px", background: "#f1f5f9" }}
            ></div>
            <div
              className="placeholder col-6 mb-2 rounded"
              style={{ height: "14px", background: "#e2e8f0" }}
            ></div>
            <div
              className="placeholder col-9 mb-3 rounded"
              style={{ height: "18px", background: "#cbd5e1" }}
            ></div>
            <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
              <div
                className="placeholder col-4 rounded"
                style={{ height: "22px", background: "#cbd5e1" }}
              ></div>
              <div
                className="placeholder col-5 rounded-pill"
                style={{ height: "36px", background: "#e2e8f0" }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
