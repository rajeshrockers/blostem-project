import type { ErrorStateProps } from '../../types';

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-red-600">{message}</div>
    </div>
  );
}
