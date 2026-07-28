"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function FeaturedJobs() {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechNova Inc.",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $150k",
    },
    {
      id: 2,
      title: "Product Designer",
      company: "Creative Studio",
      location: "New York, NY",
      type: "Contract",
      salary: "$80 - $100 / hr",
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "DataFlow Systems",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $160k",
    },
    {
      id: 4,
      title: "Marketing Manager",
      company: "Growth Hackers",
      location: "London, UK",
      type: "Full-time",
      salary: "£60k - £80k",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="w-full bg-gray-50 py-20 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-black uppercase tracking-tight mb-4">
              Featured Roles
            </h2>
            <p className="text-gray-600 font-medium text-lg max-w-xl">
              Discover the latest opportunities hand-picked by our team. Find the perfect match for your career.
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors mt-6 md:mt-0"
          >
            View All Jobs <ArrowUpRight size={20} />
          </Link>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={itemVariants}
              className="bg-white border-2 border-black p-6 md:p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-black mb-2 group-hover:underline decoration-2 underline-offset-4">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 font-medium">{job.company}</p>
                </div>
                <span className="bg-gray-100 text-black text-xs font-bold uppercase tracking-wide px-3 py-1 border border-gray-200">
                  {job.type}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm font-semibold text-gray-500 uppercase tracking-wide pt-4 border-t border-gray-100">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  {job.location}
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-black"></span>
                  {job.salary}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 md:hidden flex justify-center">
          <Link
            href="/jobs"
            className="flex items-center gap-2 font-bold uppercase tracking-wide text-black border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
          >
            View All Jobs <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
