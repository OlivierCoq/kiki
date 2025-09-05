import { useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // value will only settle after delay
    }, delay);

    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);

  return value;
}
