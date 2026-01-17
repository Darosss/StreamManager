import { useCallback, useEffect, useState } from "react";

type UseLocalStorageReturnType<T> = readonly [
  storedValue: T,
  setValue: (value: T | ((val: T) => T)) => void,
];

export const useLocalStorage = <T = unknown>(
  key: string,
  initialValue: T,
): UseLocalStorageReturnType<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [storedValue, key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue((currentPrevValue) => {
        const nextValue =
          value instanceof Function ? value(currentPrevValue) : value;
        return nextValue;
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return [storedValue, setValue] as const;
};
