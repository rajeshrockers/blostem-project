import { Link } from 'react-router-dom';
import type { EmptyStateProps } from '../../types';

export function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{message}</p>
      {action && (
        <Link
          to={action.to}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
