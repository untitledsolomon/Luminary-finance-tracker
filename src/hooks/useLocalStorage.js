import { useState, useEffect } from 'react';

function getStorageValue(key, defaultValue) {
  // Getting stored value
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);
    try {
        const initial = saved ? JSON.parse(saved) : defaultValue;
        return initial;
    } catch (error) {
        console.error(`Error parsing localStorage key “${key}”:`, error);
        return defaultValue;
    }
  }
  return defaultValue; // Return default if window is not defined (SSR)
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // Storing value
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;