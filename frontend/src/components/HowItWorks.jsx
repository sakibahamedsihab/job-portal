"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Briefcase } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Create Account",
      description: "Sign up in seconds and complete your professional profile.",
      icon: <UserPlus size={32} strokeWidth={1.5} />,
    },
    {
      id: 2,
      title: "Search Jobs",
      description:
        "Browse thousands of opportunities from top companies worldwide.",
      icon: <Search size={32} strokeWidth={1.5} />,
    },
    {
      id: 3,
      title: "Apply & Get Hired",
      description: "Apply with one click and get matched with your dream job.",
      icon: <Briefcase size={32} strokeWidth={1.5} />,
    },
  ];

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
    hidden: { opacity: 0, y: 30 },
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
    <section className="w-full bg-black text-white py-24 px-6 border-b border-black">
      <div className="max-w-6xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight mb-6">
            How It Works
          </h2>
          <p className="text-gray-400 font-medium text-lg max-w-2xl mx-auto">
            Your journey to a better career starts here. Follow these simple
            steps to land your next big opportunity.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              variants={itemVariants}
              className="bg-gray-900/70 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-lg hover:border-gray-700 hover:shadow-2xl transition-all group"
            >
              <div className="w-16 h-16 bg-white text-black flex items-center justify-center rounded-2xl mb-6 shadow-md group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide mb-3 text-white">
                {step.id}. {step.title}
              </h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
