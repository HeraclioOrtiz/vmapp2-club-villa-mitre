import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchLocales, clearError } from '../store/slices/localesSlice';

export const useLocales = () => {
  const dispatch = useAppDispatch();
  const { items: locales, loading, error } = useAppSelector((state) => state.locales);

  const loadLocales = useCallback(() => {
    return dispatch(fetchLocales());
  }, [dispatch]);

  const clearLocalesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-load locales on mount if not already loaded
  useEffect(() => {
    if (locales.length === 0 && !loading && !error) {
      loadLocales();
    }
  }, [locales.length, loading, error, loadLocales]);

  return {
    locales,
    loading,
    error,
    loadLocales,
    clearLocalesError,
  };
};
