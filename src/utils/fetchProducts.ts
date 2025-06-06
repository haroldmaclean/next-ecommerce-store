export interface Product {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image: string;
}

export const fetchProducts = async (): Promise<{ products: Product[] }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return await res.json();
};
