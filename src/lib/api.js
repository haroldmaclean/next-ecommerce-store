// lib/api.js
export const fetchProducts = async () => {
  const baseURL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const res = await fetch(`${baseURL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};
