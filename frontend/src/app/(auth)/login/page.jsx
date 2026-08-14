"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked!");

    const { data, error } = await signIn.email({
      email: formdata.email,
      password: formdata.password,
    });

    if (error) {
      console.error("Login failed: ", error.message);
      alert("Failed to Login");
    } else {
      console.log("Welcome Back!", data);
      const role = data?.user?.role;
      const destination =
        role === "admin"
          ? "/dashboard/admin"
          : role === "recruiter"
            ? "/dashboard/recruiter"
            : "/dashboard/seeker";
      router.push(destination);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            Welcome Back
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Log In To Your Account
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="name@example.com"
                required
                className="w-full bg-gray-50/70 border border-gray-200 px-4 py-3 text-sm text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                value={formdata.password}
                onChange={handleChange}
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-gray-50/70 border border-gray-200 px-4 py-3 text-sm text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="border-gray-300 rounded text-black focus:ring-black" />
                Remember me
              </label>
              <span className="text-xs font-bold text-gray-900 hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button className="w-full border border-gray-200 py-3 rounded-xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
            <LayoutGrid size={15} />
            Continue With Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-bold text-black hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
