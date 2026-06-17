import type { ButtonVariant, ButtonProps } from '../../types';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
  outline:
    'bg-transparent border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:ring-gray-500',
};

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 rounded-md transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
