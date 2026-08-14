import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-black py-16 px-6 text-center text-white border-t border-gray-800 mt-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
          Ready to take the next step?
        </h2>
        <p className="text-gray-400 font-medium max-w-lg mx-auto">
          Join thousands of professionals and top companies on our platform today.
        </p>
        <div className="pt-4">
          <Link
            href="/register"
            className="inline-block px-10 py-4 bg-white text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all"
          >
            Get Started Now
          </Link>
        </div>
        <div className="pt-12 text-xs text-gray-500 font-medium uppercase tracking-widest border-t border-gray-800 mt-12">
          &copy; {new Date().getFullYear()} Job Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
