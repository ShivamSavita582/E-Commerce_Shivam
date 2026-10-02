import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { SingleProductCard } from "./ProductCard";

const RelatedProducts = ({ category, currentProductId }) => {
  const { products } = useContext(AppContext);
  const [relatedList, setRelatedList] = useState([]);

  useEffect(() => {
    if (!category) return;
    const filtered = (products || []).filter(
      (prod) =>
        prod.category?.toLowerCase() === category?.toLowerCase() &&
        prod._id !== currentProductId
    );
    setRelatedList(filtered.slice(0, 4));
  }, [category, currentProductId, products]);

  if (relatedList.length === 0) return null;

  return (
    <section className="related-products-section my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <span
            className="text-uppercase fw-bold small text-primary"
            style={{ letterSpacing: "1px" }}
          >
            RECOMMENDED
          </span>
          <h2 className="fw-bold text-dark mb-0">Similar Products</h2>
        </div>
      </div>

      <div className="row g-4">
        {relatedList.map((product) => (
          <div key={product._id} className="col-12 col-sm-6 col-lg-3">
            <SingleProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;