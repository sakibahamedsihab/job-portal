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
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            Welcome Back
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
            Log In To Your Account
          </h1>
        </div>

        <div className="border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formdata.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                value={formdata.password}
                onChange={handleChange}
                type="password"
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="border-gray-300 rounded" />
                Remember me
              </label>
              <span className="font-semibold text-black cursor-pointer">
                Forgot Password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-sm font-bold uppercase tracking-wide py-3 hover:bg-gray-800 transition-colors"
            >
              Log In
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full border border-gray-300 py-3 flex items-center justify-center gap-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
            <LayoutGrid size={16} />
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
