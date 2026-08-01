import { Briefcase, Bookmark, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SeekerDashboardOverview() {
    return (
        <main className="max-w-5xl mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                    Welcome back, <span className="font-semibold">Alex</span>
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Here's a quick overview of your job search progress.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Applied Jobs', value: '12', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Saved Jobs', value: '4', icon: Bookmark, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Interviews', value: '1', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between group">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-semibold text-gray-900">{stat.value}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <stat.icon size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
                    <Link href="/dashboard/seeker/applications" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors">
                        View all <ChevronRight size={16} className="ml-1" />
                    </Link>
                </div>
                
                <div className="space-y-4">
                    {[
                        { role: 'Frontend Developer', company: 'TechCorp Inc.', status: 'Under Review', date: '2 days ago', statusColor: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                        { role: 'UX Designer', company: 'Creative Studio', status: 'Pending', date: '4 days ago', statusColor: 'bg-gray-50 text-gray-700 border-gray-200' },
                        { role: 'React Engineer', company: 'Startup XYZ', status: 'Interview', date: '1 week ago', statusColor: 'bg-green-50 text-green-700 border-green-200' },
                    ].map((job, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors duration-200">
                            <div>
                                <h3 className="font-medium text-gray-900">{job.role}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{job.company} &bull; {job.date}</p>
                            </div>
                            <div className="mt-3 sm:mt-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${job.statusColor}`}>
                                    {job.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}