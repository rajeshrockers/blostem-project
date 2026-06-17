import type { PageHeadingProps } from '../../types';

export function PageHeading({ children, className = '' }: PageHeadingProps) {
  return (
    <h1 className={`text-3xl font-bold text-gray-800 dark:text-white mb-6 ${className}`}>
      {children}
    </h1>
  );
}
