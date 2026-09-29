import { useContext } from "react";
import AppContext from "../context/AppContext";

export const useWishlist = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useWishlist must be used within an AppState Provider");
  }

  const wishlist = context.wishlist || { products: [] };
  const products = wishlist.products || [];
  const wishlistCount = products.length;

  const isInWishlist = (productId) => {
    return products.some((item) => {
      const id = item?.productId?._id || item?.productId || item?._id;
      return id?.toString() === productId?.toString();
    });
  };

  return {
    wishlist,
    products,
    wishlistCount,
    isInWishlist,
    addToWishlist: context.addToWishlist,
    removeFromWishlist: context.removeFromWishlist,
    clearWishlist: context.clearWishlist,
  };
};
