"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, DollarSign } from "lucide-react";
import { getJobsService } from "@/lib/jobs";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchFeatured = async () => {
      try {
        const res = await getJobsService();
        if (isMounted && res?.success && Array.isArray(res.jobs)) {
          setJobs(res.jobs.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching featured jobs:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

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
              Discover the latest opportunities posted by top companies. Find your next career step.
            </p>
          </div>
          <Link
            href="/jobs"
            className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wide text-black hover:text-gray-600 transition-colors mt-6 md:mt-0"
          >
            View All Jobs <ArrowUpRight size={20} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border-2 border-gray-200 p-8 animate-pulse space-y-4"
              >
                <div className="h-6 bg-gray-200 w-3/4"></div>
                <div className="h-4 bg-gray-100 w-1/2"></div>
                <div className="h-4 bg-gray-100 w-full pt-4"></div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-300 p-12 text-center">
            <p className="text-gray-500 font-bold uppercase tracking-wider mb-4">
              No jobs posted yet. Check back soon!
            </p>
            <Link
              href="/register"
              className="inline-block bg-black text-white font-bold uppercase text-xs tracking-widest px-6 py-3"
            >
              Post a Job as Recruiter
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {jobs.map((job) => (
              <Link key={job._id} href={`/jobs/${job._id}`}>
                <motion.div
                  variants={itemVariants}
                  className="bg-white border-2 border-black p-6 md:p-8 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-black mb-2 group-hover:underline decoration-2 underline-offset-4">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {job.companyName || job.company || "Featured Company"}
                      </p>
                    </div>
                    <span className="bg-gray-100 text-black text-xs font-bold uppercase tracking-wide px-3 py-1 border border-gray-200">
                      Full-time
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-sm font-semibold text-gray-500 uppercase tracking-wide pt-4 border-t border-gray-100">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-black" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign size={14} className="text-black" />
                      {job.salary}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

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
