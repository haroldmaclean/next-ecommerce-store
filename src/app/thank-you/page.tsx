"use client";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h1>
      <p className="text-lg mb-6">Your order has been placed successfully.</p>
      
      <Link href="/products">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}
