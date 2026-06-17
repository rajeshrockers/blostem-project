import type { CardProps } from '../../types';

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
}
