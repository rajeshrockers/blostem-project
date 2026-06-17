import { MAGIC_NUMBER } from '../../constants/constants';

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto animate-pulse">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-6" />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-4">
              <div className="w-full h-80 bg-gray-300 dark:bg-gray-600 rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: MAGIC_NUMBER.FOUR }).map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-md" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24" />
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
