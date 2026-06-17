import type { PageContainerProps } from '../../types';

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 p-6 ${className}`}>
      {children}
    </div>
  );
}
