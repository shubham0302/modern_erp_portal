/**
 * PDF-safe currency formatter that always returns a string
 * Uses simple Rs. prefix instead of ₹ symbol to avoid rendering issues in PDFs
 */
export const safeCurrency = (amount: number): string => {
  if (amount == null || typeof amount !== "number" || isNaN(amount)) {
    return "Rs. 0.00";
  }

  // Format number with Indian locale comma placement
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);

  return `Rs. ${formatted}`;
};

/**
 * Safe phone formatter that always returns a string
 */
export const safePhone = (phone: string, formatter?: (phone: string) => string): string => {
  if (!phone) return "-";
  return formatter ? formatter(phone) : phone;
};
