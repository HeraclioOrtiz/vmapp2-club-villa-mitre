import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchPuntos, canjearPuntos, clearError } from '../store/slices/puntosSlice';

export const usePuntos = () => {
  const dispatch = useAppDispatch();
  const { data: puntos, loading, error } = useAppSelector((state) => state.puntos);

  const loadPuntos = useCallback(() => {
    return dispatch(fetchPuntos());
  }, [dispatch]);

  const canjear = useCallback(
    (puntosACanjear: number) => {
      return dispatch(canjearPuntos(puntosACanjear));
    },
    [dispatch]
  );

  const clearPuntosError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-load puntos on mount if not already loaded
  useEffect(() => {
    if (!puntos && !loading && !error) {
      loadPuntos();
    }
  }, [puntos, loading, error, loadPuntos]);

  return {
    puntos,
    loading,
    error,
    loadPuntos,
    canjear,
    clearPuntosError,
  };
};
