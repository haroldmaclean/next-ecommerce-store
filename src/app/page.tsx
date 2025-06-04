"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProducts } from "@/lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        console.log("Fetched products data:", data);

        setProducts(data.products || []); // Fallback if data.products is undefined
        setError(null);
      } catch (err) {
        console.error("Error loading products:", err);
        setError("Failed to load products.");
      }
    };

    loadProducts();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <p className="text-red-600 text-lg">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <section className="w-full max-w-6xl px-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id || product.id} // Ensure key works regardless of source
                className="bg-white rounded shadow hover:shadow-lg transition p-4 text-center"
              >
                <div className="relative w-full h-48 mb-4">
                  <Image
                    src={product.image?.startsWith("/") ? product.image : "/images/apple-iphone-15.jpg"}
                    alt={product.name || "Product Image"}
                    fill
                    style={{ objectFit: "cover", borderRadius: "0.5rem" }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name || "Unnamed Product"}
                </h3>
                <p className="text-blue-600 font-bold mb-2">
                  ${product.price?.toFixed(2) || "N/A"}
                </p>
                <a
                  href={`/products/${product._id || product.id}`}
                  className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  View Product
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">Loading products...</p>
          )}
        </div>
      </section>
    </main>
  );
}
