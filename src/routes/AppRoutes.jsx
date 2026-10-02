import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "../pages/Home/Home";
import ProductPage from "../pages/Product/ProductPage";
import Shop from "../pages/Shop/Shop";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import Orders from "../pages/Orders/Orders";
import OrderConfirmation from "../pages/Orders/OrderConfirmation";
import Profile from "../pages/Profile/Profile";
import Wishlist from "../pages/Wishlist/Wishlist";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Legal from "../pages/Legal/Legal";
import NotFound from "../pages/NotFound/NotFound";
import AdminDashboard from "../pages/Admin/AdminDashboard";

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

// Route Guards
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminRoute from "../components/common/AdminRoute";

// Other components
import Address from "../components/Address";
import SearchResults from "../components/product/SearchResults";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Shop & Catalog */}
      <Route path="/shop" element={<Shop />} />

      {/* Product Details & Search */}
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/product/search/:term" element={<SearchResults />} />

      {/* Wishlist */}
      <Route path="/wishlist" element={<Wishlist />} />

      {/* Cart */}
      <Route path="/cart" element={<CartPage />} />

      {/* Protected Checkout & Address */}
      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Address />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Orders */}
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orderconfirmation"
        element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        }
      />

      {/* Protected Profile */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Console */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Information & Legal */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Legal defaultTab="privacy" />} />
      <Route path="/terms" element={<Legal defaultTab="terms" />} />

      {/* 404 Not Found Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
