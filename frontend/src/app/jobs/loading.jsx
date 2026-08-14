export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pb-24">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="border-b border-gray-200 pb-6 space-y-2">
          <div className="h-4 bg-gray-200 w-32"></div>
          <div className="h-8 bg-gray-300 w-64"></div>
        </div>

        <div className="bg-white border-2 border-gray-200 p-8 space-y-4">
          <div className="h-4 bg-gray-200 w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-12 bg-gray-100"></div>
            <div className="h-12 bg-gray-100"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-8 border-2 border-gray-200 space-y-4"
            >
              <div className="h-6 bg-gray-300 w-1/2"></div>
              <div className="h-4 bg-gray-200 w-1/4"></div>
              <div className="h-10 bg-gray-100 w-full pt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
