"use client";

import Image from "next/image";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      ...product,
      quantity: 1, // 🔑 Always add quantity
    };

    // ✅ Bonus debugging tip:
    console.log("Adding to cart:", cartItem);

    addToCart(cartItem);
  };

  return (
    <div className="border rounded p-4 shadow-md">
      {/* Optional: Debugging render confirmation */}
      {console.log("Rendering product:", product)}

      <Image
        src={product.image}
        alt={product.name}
        width={300}
        height={200}
        className="w-full h-auto object-cover"
      />
      <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-700">${product.price.toFixed(2)}</p>
      <button
        onClick={handleAddToCart}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
