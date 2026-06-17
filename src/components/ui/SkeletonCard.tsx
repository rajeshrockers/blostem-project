// Animated skeleton placeholder for a product card.
export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-600" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16" />
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-20" />
        </div>
      </div>
    </div>
  );
}
