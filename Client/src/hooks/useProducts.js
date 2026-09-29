import { useContext } from "react";
import AppContext from "../context/AppContext";

export const useProducts = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useProducts must be used within an AppState Provider");
  }

  return {
    products: context.products,
    filteredData: context.filteredData,
    setFilteredData: context.setFilteredData,
    fetchProducts: context.fetchProducts,
    loading: context.loadingProducts,
  };
};
