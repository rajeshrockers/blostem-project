import { useEffect, useState } from 'react';

// Delays updating the returned value until 'delay' ms have passed
// without the source value changing. Ideal for search inputs.
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
