import { useState, useEffect } from 'react';

/**
 * Debounces a value over the specified delay in milliseconds
 * @param {any} value 
 * @param {number} delayMs 
 * @returns {any}
 */
export function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}

export default useDebounce;
