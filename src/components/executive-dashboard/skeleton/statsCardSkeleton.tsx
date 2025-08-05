
export const StatsCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg border p-4 flex items-center space-x-4 animate-pulse">
      <div className="bg-gray-200 p-3 rounded-full w-12 h-12" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  )
}