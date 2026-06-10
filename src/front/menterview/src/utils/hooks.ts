import { useEffect, useRef, useCallback, useState } from 'react';

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T>(value);
  const [prevValue, setPrevValue] = useState<T | undefined>(undefined);

  useEffect(() => {
    const previous = ref.current;
    ref.current = value;
    queueMicrotask(() => {
      setPrevValue(previous);
    });
  }, [value]);

  return prevValue;
};

export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timerId = globalThis.setTimeout(() => {
      setIsMounted(true);
    }, 0);

    return () => {
      globalThis.clearTimeout(timerId);
    };
  }, []);

  return isMounted;
};

export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
): {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: E | null;
} => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      const timerId = globalThis.setTimeout(() => {
        void execute();
      }, 0);

      return () => {
        globalThis.clearTimeout(timerId);
      };
    }

    return undefined;
  }, [execute, immediate]);

  return { status, data, error };
};

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = globalThis.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      globalThis.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Handle error silently
    }
  }, [key]);

  return [storedValue, setValue];
};
