"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    // Simulate setting a "token"
    localStorage.setItem("token", "mock-token");
    router.push("/checkout"); // Redirect to protected route
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Fake Login
      </button>
    </div>
  );
}
