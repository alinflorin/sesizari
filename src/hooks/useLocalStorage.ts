import { useCallback } from "react";

export default function useLocalStorage() {
  const getFromLocalStorage = useCallback((key: string) => {
    return localStorage.getItem(key) || undefined;
  }, []);
  const setInLocalStorage = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
  }, []);
  const deleteFromLocalStorage = useCallback((key: string) => {
    localStorage.removeItem(key);
  }, []);
  return { getFromLocalStorage, setInLocalStorage, deleteFromLocalStorage };
}
