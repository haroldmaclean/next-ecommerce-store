"use client";

import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

export default function ProductsPage() {
  if (!products || products.length === 0) {
    return <p className="p-6 text-red-500">No products available.</p>;
  }

  // Bonus tip: Keep this function for better readability or debugging
  const renderProduct = (product: Product) => {
    console.log("Rendering product:", product);
    return <ProductCard key={product.id} product={product} />;
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map(renderProduct)}
      </div>
    </main>
  );
}
