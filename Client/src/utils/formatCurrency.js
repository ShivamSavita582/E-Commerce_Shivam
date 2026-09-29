export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount);
};

export const formatPrice = (amount) => {
  const numericAmount = Number(amount) || 0;
  return `₹${numericAmount.toLocaleString("en-IN")}`;
};
