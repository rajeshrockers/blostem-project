// Animated skeleton placeholder for the profile page.
export default function SkeletonProfile() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 animate-pulse">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-600" />
        <div className="space-y-3 w-full">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex gap-3">
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-32" />
        <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-24" />
      </div>
    </div>
  );
}
