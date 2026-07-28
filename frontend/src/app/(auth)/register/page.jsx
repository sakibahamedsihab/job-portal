"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { LayoutGrid } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Ready for Better Auth Sign Up:", formData);
    const { data, error } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (error) {
      console.error("Sign up failed: ", error.message);
      alert("failed to sign up");
    } else {
      console.log("User created successfully:", data);
      alert("Registration Successful!");
      router.push("/dashboard/recruiter");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            New Here?
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
            Create An Account
          </h1>
        </div>

        <div className="border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300  px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white text-sm font-bold uppercase tracking-wide  py-3 hover:bg-gray-800 transition-colors"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Or
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button className="w-full border border-gray-300  py-3 flex items-center justify-center gap-3 text-sm font-semibold text-black hover:bg-gray-50 transition-colors">
            <LayoutGrid size={16} />
            Sign Up With Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <span className="font-bold text-black cursor-pointer">Log In</span>
        </p>
      </div>
    </div>
  );
}
