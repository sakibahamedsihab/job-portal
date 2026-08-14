export default function SeekerLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-pulse">
      <div className="border-b border-gray-200 pb-6 space-y-2">
        <div className="h-8 bg-gray-300 w-64"></div>
        <div className="h-4 bg-gray-200 w-48"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-28 bg-gray-100 border border-gray-200"></div>
        <div className="h-28 bg-gray-100 border border-gray-200"></div>
      </div>

      <div className="h-64 bg-white border border-gray-200 p-6 space-y-4">
        <div className="h-6 bg-gray-200 w-36"></div>
        <div className="h-16 bg-gray-50"></div>
        <div className="h-16 bg-gray-50"></div>
      </div>
    </div>
  );
}
