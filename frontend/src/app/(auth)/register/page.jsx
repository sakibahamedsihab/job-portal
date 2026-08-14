"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const userRole = formData.role === "recruiter" ? "recruiter" : "seeker";

    const { data, error } = await signUp.email({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      role: userRole,
    });

    if (error) {
      console.error("Sign up failed: ", error.message);
      setErrorMessage(error.message || "Failed to create account.");
      setIsLoading(false);
    } else {
      console.log("User created successfully:", data);
      const destination =
        userRole === "recruiter"
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
            New Here?
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-black uppercase">
            Create An Account
          </h1>
        </div>

        <div className="border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 border-2 border-red-500 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "seeker" })}
                  className={`py-3 border-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    formData.role === "seeker"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "recruiter" })}
                  className={`py-3 border-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                    formData.role === "recruiter"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-500 hover:border-gray-400"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-black uppercase mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
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
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
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
                className="w-full border border-gray-300 px-4 py-2.5 text-sm text-black focus:outline-none focus:border-black transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white text-sm font-bold uppercase tracking-wide py-3 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
              }`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
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
            Sign Up With Google
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-black hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
