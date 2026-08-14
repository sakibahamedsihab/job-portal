export default function RecruiterLoading() {
  return (
    <div className="pt-10 px-8 sm:px-12 w-full bg-white min-h-screen animate-pulse space-y-8">
      <div className="border-b border-gray-200 pb-6 space-y-2">
        <div className="h-4 bg-gray-200 w-32"></div>
        <div className="h-8 bg-gray-300 w-64"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-36 bg-gray-100 border border-gray-200 p-8"></div>
        <div className="h-36 bg-gray-100 border border-gray-200 p-8"></div>
      </div>
    </div>
  );
}
