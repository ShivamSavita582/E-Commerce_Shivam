import React, { useContext, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import AppContext from "../../context/AppContext";
import { SingleProductCard } from "../../components/product/ProductCard";
import EmptyState from "../../components/common/EmptyState";
import { productService } from "../../services/productService";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import "./Shop.css";

const Shop = () => {
  const { products: contextProducts } = useContext(AppContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get("category") || "all";
  const initialBrand = searchParams.get("brand") || "all";
  const initialSort = searchParams.get("sort") || "featured";

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: "", max: "" });
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync category from URL param if user navigated with ?category=...
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat.toLowerCase());
  }, [searchParams]);

  // Extract unique categories and brands from current catalog
  const { availableCategories, availableBrands } = useMemo(() => {
    const cats = new Set();
    const brands = new Set();

    (contextProducts || []).forEach((prod) => {
      if (prod.category) cats.add(prod.category.toLowerCase());
      if (prod.brand) brands.add(prod.brand);
    });

    return {
      availableCategories: ["all", ...Array.from(cats)],
      availableBrands: ["all", ...Array.from(brands)],
    };
  }, [contextProducts]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...(contextProducts || [])];

    // Category filter with alias matching
    if (selectedCategory !== "all") {
      const targetCat = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const pCat = p.category?.toLowerCase() || "";
        if (pCat === targetCat) return true;
        if (
          (targetCat === "laptop" ||
            targetCat === "computers" ||
            targetCat === "computer" ||
            targetCat === "laptops") &&
          (pCat === "laptop" ||
            pCat === "computers" ||
            pCat === "computer" ||
            pCat === "laptops")
        ) {
          return true;
        }
        if (
          (targetCat === "mobile" ||
            targetCat === "mobiles" ||
            targetCat === "phone" ||
            targetCat === "phones" ||
            targetCat === "smartphone" ||
            targetCat === "smartphones") &&
          (pCat === "mobile" ||
            pCat === "mobiles" ||
            pCat === "phone" ||
            pCat === "phones")
        ) {
          return true;
        }
        if (
          (targetCat === "camera" || targetCat === "cameras") &&
          (pCat === "camera" || pCat === "cameras")
        ) {
          return true;
        }
        if (
          (targetCat === "accessories" ||
            targetCat === "accessory" ||
            targetCat === "headphones" ||
            targetCat === "audio") &&
          (pCat === "accessories" ||
            pCat === "accessory" ||
            pCat === "headphones" ||
            pCat === "audio")
        ) {
          return true;
        }
        return false;
      });
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter(
        (p) => p.brand?.toLowerCase() === selectedBrand.toLowerCase()
      );
    }

    // Price filter
    if (appliedPriceRange.min !== "") {
      result = result.filter((p) => p.price >= Number(appliedPriceRange.min));
    }
    if (appliedPriceRange.max !== "") {
      result = result.filter((p) => p.price <= Number(appliedPriceRange.max));
    }

    // Rating filter
    if (selectedRating > 0) {
      result = result.filter((p) => (p.rating || 0) >= selectedRating);
    }

    // Stock availability filter
    if (inStockOnly) {
      result = result.filter((p) => p.qty === undefined || p.qty > 0);
    }

    // Sorting
    if (sortBy === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [
    contextProducts,
    selectedCategory,
    selectedBrand,
    appliedPriceRange,
    selectedRating,
    inStockOnly,
    sortBy,
  ]);

  // Pagination slicing
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    setAppliedPriceRange({ min: minPrice, max: maxPrice });
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setMinPrice("");
    setMaxPrice("");
    setAppliedPriceRange({ min: "", max: "" });
    setSelectedRating(0);
    setInStockOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <section className="shop-page">
      {/* Header */}
      <div className="shop-header">
        <span className="shop-eyebrow">OUR CATALOG</span>
        <h1>
          Discover <span>Innovative Technology</span>
        </h1>
        <p>
          Browse our handpicked collection of laptops, mobiles, cameras and accessories, engineered for performance and elegance.
        </p>
      </div>

      {/* Toolbar */}
      <div className="shop-toolbar">
        <div className="toolbar-left">
          <button
            className="filter-toggle-btn"
            onClick={() => setMobileFilterOpen((v) => !v)}
          >
            <span className="material-symbols-outlined">tune</span>
            Filters
          </button>
          <span className="results-count">
            Showing <strong>{filteredProducts.length}</strong> products
          </span>
        </div>

        <div className="toolbar-right">
          <div className="sort-wrapper">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="featured">Featured</option>
              <option value="newest">New Arrivals</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shop Layout */}
      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside
          className={`filter-sidebar ${mobileFilterOpen ? "mobile-active" : ""}`}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="filter-group-title">Filter Products</span>
            <button
              onClick={handleResetFilters}
              className="clear-filter-link"
              title="Reset all filters"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-group-title">Categories</span>
            </div>
            <div className="filter-options-list">
              {availableCategories.map((cat) => (
                <label key={cat} className="filter-option-item">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      setCurrentPage(1);
                      if (cat !== "all") {
                        setSearchParams({ category: cat });
                      } else {
                        setSearchParams({});
                      }
                    }}
                  />
                  <span className="text-capitalize">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-group-title">Price Range (₹)</span>
            </div>
            <form onSubmit={handleApplyPrice}>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <button type="submit" className="apply-price-btn">
                Apply Price
              </button>
            </form>
          </div>

          {/* Brands */}
          {availableBrands.length > 2 && (
            <div className="filter-group">
              <div className="filter-group-header">
                <span className="filter-group-title">Brand</span>
              </div>
              <div className="filter-options-list">
                {availableBrands.map((brand) => (
                  <label key={brand} className="filter-option-item">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === brand}
                      onChange={() => {
                        setSelectedBrand(brand);
                        setCurrentPage(1);
                      }}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-group-title">Minimum Rating</span>
            </div>
            <div className="filter-options-list">
              {[4, 3, 2].map((r) => (
                <label key={r} className="filter-option-item">
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedRating === r}
                    onChange={() => {
                      setSelectedRating(r);
                      setCurrentPage(1);
                    }}
                  />
                  <span>{r}★ & above</span>
                </label>
              ))}
              <label className="filter-option-item">
                <input
                  type="radio"
                  name="rating"
                  checked={selectedRating === 0}
                  onChange={() => {
                    setSelectedRating(0);
                    setCurrentPage(1);
                  }}
                />
                <span>All Ratings</span>
              </label>
            </div>
          </div>

          {/* Stock Availability */}
          <div className="filter-group">
            <div className="filter-group-header">
              <span className="filter-group-title">Availability</span>
            </div>
            <label className="filter-option-item">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Mobile Close Button */}
          {mobileFilterOpen && (
            <button
              className="btn btn-dark w-100 mt-3"
              onClick={() => setMobileFilterOpen(false)}
            >
              Done Filtering
            </button>
          )}
        </aside>

        {/* Product Grid Area */}
        <main className="shop-products-area">
          {paginatedProducts.length === 0 ? (
            <EmptyState
              icon="filter_alt_off"
              title="No Products Match Your Filters"
              description="Try adjusting or clearing your active filters to view more products."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <div className="shop-grid">
              {paginatedProducts.map((product) => (
                <SingleProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                aria-label="Previous Page"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNumber = idx + 1;
                return (
                  <button
                    key={pageNumber}
                    className={`page-btn ${currentPage === pageNumber ? "active" : ""}`}
                    onClick={() => {
                      setCurrentPage(pageNumber);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage((p) => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 300, behavior: "smooth" });
                }}
                aria-label="Next Page"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </main>
      </div>
    </section>
  );
};

export default Shop;