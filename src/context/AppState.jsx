import React, { useEffect, useState, useCallback } from "react";
import AppContext from "./AppContext";
import { toast } from "react-toastify";
import { authService } from "../services/authService";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";
import { orderService } from "../services/orderService";
import { couponService } from "../services/couponService";
import { notify } from "../utils/notification";
import { API_BASE_URL } from "../services/api";

const AppState = (props) => {
  const url = API_BASE_URL;

  // Authentication State
  const initialToken = localStorage.getItem("token") || "";
  const [token, setToken] = useState(initialToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);

  // Products State
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Cart & Wishlist State
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState({ products: [] });
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Address & Orders State
  const [userAddress, setUserAddress] = useState(null);
  const [userOrder, setUserOrder] = useState([]);

  // Flag for triggering refetches
  const [reload, setReload] = useState(false);

  // ==========================================
  // PRODUCTS FETCHING
  // ==========================================
  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoadingProducts(true);
      const data = await productService.getProducts(params);
      const productList = data.products || [];
      setProducts(productList);
      setFilteredData(productList);
      return data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ==========================================
  // USER PROFILE
  // ==========================================
  const userProfile = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const data = await authService.getProfile();
      if (data?.user) {
        setUser(data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn("Failed to load user profile:", error?.message);
    }
  }, []);

  // Update profile
  const updateUserProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data?.user) {
        setUser(data.user);
        notify.success("Profile updated successfully!");
        return data;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update profile";
      notify.error(msg);
      throw error;
    }
  };

  // ==========================================
  // GUEST STORAGE HELPERS
  // ==========================================
  const getGuestCart = () => {
    try {
      const raw = localStorage.getItem("guest_cart");
      return raw ? JSON.parse(raw) : { items: [] };
    } catch {
      return { items: [] };
    }
  };

  const saveGuestCart = (c) => {
    try {
      localStorage.setItem("guest_cart", JSON.stringify(c));
    } catch (err) {
      console.error("Local cart error:", err);
    }
  };

  const getGuestWishlist = () => {
    try {
      const raw = localStorage.getItem("guest_wishlist");
      return raw ? JSON.parse(raw) : { products: [] };
    } catch {
      return { products: [] };
    }
  };

  const saveGuestWishlist = (wl) => {
    try {
      localStorage.setItem("guest_wishlist", JSON.stringify(wl));
    } catch (err) {
      console.error("Local wishlist error:", err);
    }
  };

  // ==========================================
  // CART OPERATIONS (GUEST + AUTHENTICATED)
  // ==========================================
  const userCart = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      const local = getGuestCart();
      setCart(local);
      return;
    }
    try {
      const data = await cartService.getCart();
      setCart(data.cart || { items: [] });
    } catch (error) {
      console.warn("Cart fetch issue:", error?.message);
      const local = getGuestCart();
      setCart(local);
    }
  }, []);

  const addToCart = async (productId, title, price, qty = 1, imgSrc) => {
    const quantityToAdd = Number(qty) || 1;
    const unitPrice = Number(price) || 0;
    const prodIdStr = productId?.toString();

    // Guest cart fallback
    if (!localStorage.getItem("token")) {
      const current = getGuestCart();
      const idx = current.items.findIndex(
        (it) => it.productId?.toString() === prodIdStr
      );
      if (idx > -1) {
        current.items[idx].qty += quantityToAdd;
        current.items[idx].price = unitPrice * current.items[idx].qty;
      } else {
        current.items.push({
          _id: "guest_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
          productId: prodIdStr,
          title: title || "Product",
          price: unitPrice * quantityToAdd,
          qty: quantityToAdd,
          imgSrc: imgSrc || "",
        });
      }
      saveGuestCart(current);
      setCart({ ...current });
      notify.success("Added to cart!");
      return { success: true, cart: current };
    }

    // Authenticated cart
    try {
      const data = await cartService.addToCart(productId, title, price, quantityToAdd, imgSrc);
      setCart(data.cart);
      notify.success(data.message || "Added to cart!");
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add item to cart";
      notify.error(msg);
      throw error;
    }
  };

  const decreaseQty = async (productId, qty = 1) => {
    const prodIdStr = productId?.toString();
    const qtyToSubtract = Number(qty) || 1;

    if (!localStorage.getItem("token")) {
      const current = getGuestCart();
      const idx = current.items.findIndex(
        (it) => it.productId?.toString() === prodIdStr
      );
      if (idx > -1) {
        const item = current.items[idx];
        const unitPrice = item.price / item.qty;
        if (item.qty > qtyToSubtract) {
          item.qty -= qtyToSubtract;
          item.price = unitPrice * item.qty;
        } else {
          current.items.splice(idx, 1);
        }
        saveGuestCart(current);
        setCart({ ...current });
        notify.success("Quantity updated");
      }
      return;
    }

    try {
      const data = await cartService.decreaseQty(productId, qtyToSubtract);
      setCart(data.cart);
      notify.success(data.message || "Quantity updated");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update quantity";
      notify.error(msg);
    }
  };

  const removeFromCart = async (productId) => {
    const prodIdStr = productId?.toString();

    if (!localStorage.getItem("token")) {
      const current = getGuestCart();
      current.items = current.items.filter(
        (it) => it.productId?.toString() !== prodIdStr
      );
      saveGuestCart(current);
      setCart({ ...current });
      notify.success("Item removed from cart");
      return;
    }

    try {
      const data = await cartService.removeFromCart(productId);
      setCart(data.cart);
      notify.success(data.message || "Item removed from cart");
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to remove item";
      notify.error(msg);
    }
  };

  const clearCart = async () => {
    saveGuestCart({ items: [] });
    if (localStorage.getItem("token")) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn("Backend clear cart error:", err);
      }
    }
    setCart({ items: [] });
    setAppliedCoupon(null);
    notify.success("Cart cleared");
  };

  // ==========================================
  // WISHLIST OPERATIONS (GUEST + AUTHENTICATED)
  // ==========================================
  const fetchWishlist = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      setWishlist(getGuestWishlist());
      return;
    }
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data.wishlist || { products: [] });
    } catch (error) {
      console.warn("Wishlist fetch issue:", error?.message);
      setWishlist(getGuestWishlist());
    }
  }, []);

  const addToWishlist = async (productId) => {
    const prodIdStr = productId?.toString();

    if (!localStorage.getItem("token")) {
      const current = getGuestWishlist();
      const exists = current.products.some(
        (it) => (it.productId?._id || it.productId || it._id)?.toString() === prodIdStr
      );
      if (!exists) {
        const prodInfo = (products || []).find((p) => p._id?.toString() === prodIdStr);
        current.products.push({
          _id: "gw_" + Date.now(),
          productId: prodInfo || { _id: productId },
        });
        saveGuestWishlist(current);
        setWishlist({ ...current });
        notify.success("Added to your wishlist! ♥");
      } else {
        notify.info("Already in your wishlist");
      }
      return;
    }

    try {
      const data = await wishlistService.addToWishlist(productId);
      setWishlist(data.wishlist);
      notify.success("Added to your wishlist! ♥");
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to add to wishlist";
      notify.warning(msg);
    }
  };

  const removeFromWishlist = async (productId) => {
    const prodIdStr = productId?.toString();

    if (!localStorage.getItem("token")) {
      const current = getGuestWishlist();
      current.products = current.products.filter(
        (it) => (it.productId?._id || it.productId || it._id)?.toString() !== prodIdStr
      );
      saveGuestWishlist(current);
      setWishlist({ ...current });
      notify.info("Removed from your wishlist");
      return;
    }

    try {
      const data = await wishlistService.removeFromWishlist(productId);
      setWishlist(data.wishlist);
      notify.info("Removed from your wishlist");
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to remove from wishlist";
      notify.error(msg);
    }
  };

  const clearWishlist = async () => {
    saveGuestWishlist({ products: [] });
    if (localStorage.getItem("token")) {
      try {
        await wishlistService.clearWishlist();
      } catch (err) {
        console.warn("Backend clear wishlist error:", err);
      }
    }
    setWishlist({ products: [] });
    notify.success("Wishlist cleared");
  };

  // ==========================================
  // COUPON OPERATIONS
  // ==========================================
  const applyCoupon = async (code, cartTotal) => {
    try {
      const data = await couponService.applyCoupon(code, cartTotal);
      if (data?.success) {
        setAppliedCoupon({
          code: data.code,
          discountAmount: data.discountAmount,
          finalTotal: data.finalTotal,
        });
        notify.success(data.message);
        return data;
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Invalid coupon code";
      notify.error(msg);
      throw error;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    notify.info("Coupon removed");
  };

  // ==========================================
  // ADDRESS & ORDERS
  // ==========================================
  const getAddress = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const data = await orderService.getAddress();
      setUserAddress(data.userAddress || null);
    } catch (error) {
      console.warn("Address fetch issue:", error?.message);
    }
  }, []);

  const shippingAddress = async (
    fullName,
    address,
    city,
    state,
    country,
    pincode,
    phoneNumber
  ) => {
    try {
      const data = await orderService.addAddress({
        fullName,
        address,
        city,
        state,
        country,
        pincode,
        phoneNumber,
      });
      setUserAddress(data.userAddress);
      notify.success(data.message || "Shipping address saved");
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to save address";
      notify.error(msg);
      throw error;
    }
  };

  const user_Order = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    try {
      const data = await orderService.getUserOrders();
      setUserOrder(Array.isArray(data) ? data : data?.orders || []);
    } catch (error) {
      console.warn("Order fetch issue:", error?.message);
    }
  }, []);

  // Sync guest cart to backend on login
  const syncGuestData = async () => {
    const guestCart = getGuestCart();
    if (guestCart.items && guestCart.items.length > 0) {
      for (const item of guestCart.items) {
        try {
          const unitPrice = item.price / item.qty;
          await cartService.addToCart(
            item.productId,
            item.title,
            unitPrice,
            item.qty,
            item.imgSrc
          );
        } catch (e) {
          console.warn("Guest cart sync:", e);
        }
      }
      saveGuestCart({ items: [] });
    }
  };

  // ==========================================
  // AUTHENTICATION: LOGIN, REGISTER, LOGOUT
  // ==========================================
  const register = async (name, email, password) => {
    try {
      const data = await authService.register(name, email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        await syncGuestData();
        notify.success(data.message || "Registration successful!");
        setReload((r) => !r);
      }
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed";
      notify.error(msg);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setUser(data.user);
        await syncGuestData();
        notify.success(data.message || "Welcome back!");
        setReload((r) => !r);
      }
      return data;
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed. Check your credentials.";
      notify.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken("");
    setIsAuthenticated(false);
    setUser(null);
    setCart({ items: [] });
    setWishlist({ products: [] });
    setUserAddress(null);
    setUserOrder([]);
    setAppliedCoupon(null);
    notify.success("Logged out successfully");
  };

  // Initial load effect
  useEffect(() => {
    fetchProducts();
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      setToken(currentToken);
      setIsAuthenticated(true);
      userProfile();
      userCart();
      fetchWishlist();
      getAddress();
      user_Order();
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoadingAuth(false);
  }, [reload, fetchProducts, userProfile, userCart, fetchWishlist, getAddress, user_Order]);

  return (
    <AppContext.Provider
      value={{
        // Products
        products,
        filteredData,
        setFilteredData,
        fetchProducts,
        loadingProducts,

        // Auth
        token,
        setToken,
        user,
        isAuthenticated,
        setIsAuthenticated,
        loadingAuth,
        login,
        register,
        logout,
        updateUserProfile,
        userProfile,

        // Cart
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,

        // Wishlist
        wishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist,

        // Shipping & Orders
        userAddress,
        shippingAddress,
        getAddress,
        userOrder,
        fetchOrders: user_Order,

        // Legacy compatibility
        url,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppState;
