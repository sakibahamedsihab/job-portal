import Link from "next/link";

// একটু বড় ডামি ডাটার অ্যারে (ডেসক্রিপশনসহ)
const DUMMY_JOBS = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions BD",
    location: "Dhaka",
    salary: "60k",
    description:
      "We are looking for a passionate Frontend Developer to join our team. You will be responsible for building the user interface of our web applications.",
    requirements: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
  },
  {
    id: 2,
    title: "React Developer",
    company: "AppX",
    location: "Remote",
    salary: "80k",
    description:
      "Join our remote team to build scaleable React applications. Strong state management knowledge is highly required.",
    requirements: ["React", "Redux Toolkit", "Axios", "Git"],
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "Mirpur",
    salary: "50k",
    description:
      "Looking for a UI/UX designer who can create beautiful and intuitive user experiences for mobile and web platforms.",
    requirements: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
  },
];

export default async function JobDetailsPage({ params }) {
  const { id } = await params;
  // টাস্ক ১: DUMMY_JOBS অ্যারে থেকে .find() ব্যবহার করে সঠিক জবটি খুঁজে বের করো
  // হিন্ট: params.id কে নাম্বার বানিয়ে ম্যাচ করবে
  const job = DUMMY_JOBS.find((j) => j.id.toString() === id.toString());

  // টাস্ক ২: যদি জব খুঁজে না পাওয়া যায় (null/undefined হয়), তবে একটি মেসেজ দেখাও
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Job Not Found!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-sm border border-gray-200">
        {/* ব্যাক বাটন */}
        <Link
          href="/jobs"
          className="text-sm font-bold text-gray-500 hover:text-black mb-6 inline-block"
        >
          ← Back to Jobs
        </Link>

        {/* জবের মূল হেডার */}
        <h1 className="text-3xl font-extrabold text-black uppercase mb-2">
          {job.title}
        </h1>
        <p className="text-lg text-gray-600 font-medium mb-4">
          {job.company} • {job.location}
        </p>

        <div className="inline-block bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700 mb-8">
          Salary: {job.salary}
        </div>

        {/* জব ডেসক্রিপশন সেকশন */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-black uppercase mb-3">
            Job Description
          </h3>
          <p className="text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        {/* রিকোয়ারমেন্টস সেকশন (লুপ চালিয়ে দেখাতে হবে) */}
        <div>
          <h3 className="text-lg font-bold text-black uppercase mb-3">
            Requirements
          </h3>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <button className="w-full bg-black text-white font-bold uppercase tracking-wide py-3 mt-10 hover:bg-gray-800 transition-colors">
          Apply For This Job
        </button>
      </div>
    </div>
  );
}
