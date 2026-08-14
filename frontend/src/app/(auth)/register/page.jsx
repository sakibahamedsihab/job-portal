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
    <div className="min-h-screen bg-gray-50/60 flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
            New Here?
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Create An Account
          </h1>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMessage && (
              <div className="p-4 border border-red-300 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-2xl">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "seeker" })}
                  className={`py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    formData.role === "seeker"
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "recruiter" })}
                  className={`py-3 border text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    formData.role === "recruiter"
                      ? "border-black bg-black text-white shadow-sm"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  Recruiter
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                className="w-full bg-gray-50/70 border border-gray-200 px-4 py-3 text-sm text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className="w-full bg-gray-50/70 border border-gray-200 px-4 py-3 text-sm text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wide text-gray-900 uppercase mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-gray-50/70 border border-gray-200 px-4 py-3 text-sm text-gray-900 rounded-xl focus:bg-white focus:outline-none focus:border-black transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-black text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl shadow-md hover:bg-gray-800 hover:shadow-lg transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
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
