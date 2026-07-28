"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-white py-24 px-6 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center border-b border-gray-200 overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold text-black uppercase tracking-tight leading-tight"
        >
          Find Your Dream Job Today
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-2xl text-gray-600 font-medium max-w-2xl mx-auto"
        >
          Connect with top employers and discover opportunities that match your skills and passion.
        </motion.p>
        
        <motion.div 
          variants={itemVariants}
          className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/jobs"
            className="w-full sm:w-auto px-8 py-4 bg-black text-white font-bold text-lg uppercase tracking-wide border-2 border-black hover:bg-white hover:text-black transition-colors"
          >
            Explore Jobs
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-wide border-2 border-black hover:bg-gray-100 transition-colors"
          >
            Post a Job
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
