import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { SingleProductCard } from "./ProductCard";
import EmptyState from "../common/EmptyState";

const SearchResults = () => {
  const { products } = useContext(AppContext);
  const { term } = useParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!term) return;
    const searchTerm = term.toLowerCase().trim();
    const matches = (products || []).filter(
      (prod) =>
        prod.title?.toLowerCase().includes(searchTerm) ||
        prod.description?.toLowerCase().includes(searchTerm) ||
        prod.category?.toLowerCase().includes(searchTerm) ||
        prod.brand?.toLowerCase().includes(searchTerm)
    );
    setResults(matches);
  }, [term, products]);

  return (
    <div className="container py-5" style={{ minHeight: "80vh" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="text-secondary small fw-semibold">SEARCH RESULTS</span>
          <h1 className="fw-bold mb-1">
            Results for <span className="text-primary">"{term}"</span>
          </h1>
          <p className="text-secondary mb-0">
            Found {results.length} {results.length === 1 ? "matching item" : "matching items"}
          </p>
        </div>

        <Link to="/shop" className="btn btn-outline-secondary rounded-pill px-4">
          View All Products
        </Link>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon="search_off"
          title="No Matching Products"
          description={`We couldn't find any products matching "${term}". Try searching with different keywords or check out our full shop.`}
          actionText="Browse Shop"
          actionLink="/shop"
        />
      ) : (
        <div className="row g-4">
          {results.map((product) => (
            <div key={product._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <SingleProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;