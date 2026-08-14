"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, DollarSign, Building } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { getJobsService } from "@/lib/jobs";

export default function FeaturedJobs() {
  const { data: session } = useSession();
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
              href={
                session?.user?.role === "recruiter"
                  ? "/dashboard/recruiter/my-jobs/create"
                  : "/register"
              }
              className="inline-block bg-black text-white font-bold uppercase text-xs tracking-widest px-6 py-3 hover:bg-gray-800 transition-colors"
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
            {jobs.map((job) => {
              const company = job.companyName || job.company || "Featured Company";
              const companyInitial = (company[0] || "C").toUpperCase();

              return (
                <Link key={job._id} href={`/jobs/${job._id}`}>
                  <motion.div
                    variants={itemVariants}
                    className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 hover:-translate-y-1.5 hover:shadow-xl hover:border-black transition-all duration-300 group cursor-pointer h-full flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm group-hover:scale-105 transition-transform">
                            {companyInitial}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                              <Building size={12} className="text-gray-400" />
                              {company}
                            </p>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {job.category || "Engineering"}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {job.jobType || "Full-time"}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {job.workplaceType || "Remote"}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">
                        {job.title}
                      </h3>

                      {job.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                          {job.description}
                        </p>
                      )}

                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 my-4">
                          {job.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-gray-100/80 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200/60"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-600">
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                          <MapPin size={13} className="text-gray-400" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 font-bold text-gray-900">
                          <DollarSign size={13} className="text-emerald-600" />
                          {job.salary}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-black group-hover:translate-x-1 transition-transform">
                        Details <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
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
