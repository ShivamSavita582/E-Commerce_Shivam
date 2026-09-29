import { useContext } from "react";
import AppContext from "../context/AppContext";

export const useCart = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useCart must be used within an AppState Provider");
  }

  const items = context.cart?.items || [];
  const itemCount = items.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);
  const subtotal = items.reduce(
    (acc, item) => acc + (Number(item.price) || 0),
    0
  );

  return {
    cart: context.cart,
    items,
    itemCount,
    subtotal,
    addToCart: context.addToCart,
    decreaseQty: context.decreaseQty,
    removeFromCart: context.removeFromCart,
    clearCart: context.clearCart,
    appliedCoupon: context.appliedCoupon,
    applyCoupon: context.applyCoupon,
    removeCoupon: context.removeCoupon,
  };
};
