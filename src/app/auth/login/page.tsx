"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    router.push("/groups");
    return;
  }
  }, [router]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setTimeout(() => {
          router.push("/groups");
          router.refresh();
        }, 100);
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl bg-white">
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white p-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Welcome Back to ChatLM!</h2>
            <p className="mt-4 text-md opacity-90">
              Log in to access your groups and chat with AI assistants.
            </p>
          </div>
        </div>

        <div className="p-8 sm:p-10 bg-white">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-center text-gray-500">
            Or{" "}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 hover:underline"
            >
              create a new account
            </Link>
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500">
            Guest credentials:
            <div className="mt-2 text-sm text-gray-500">
              <strong>Email: alice@example.com</strong>
              <strong> Password: password123</strong>
          </div>
          <div className="mt-2 text-sm text-gray-500">
              <strong>Email: bob@example.com</strong>
              <strong> Password: password123</strong>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
