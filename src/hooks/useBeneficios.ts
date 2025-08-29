import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchBeneficios, clearError } from '../store/slices/beneficiosSlice';

export const useBeneficios = () => {
  const dispatch = useAppDispatch();
  const { items: beneficios, loading, error } = useAppSelector((state) => state.beneficios);

  const loadBeneficios = useCallback(() => {
    return dispatch(fetchBeneficios());
  }, [dispatch]);

  const clearBeneficiosError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-load beneficios on mount if not already loaded
  useEffect(() => {
    if (beneficios.length === 0 && !loading && !error) {
      loadBeneficios();
    }
  }, [beneficios.length, loading, error, loadBeneficios]);

  return {
    beneficios,
    loading,
    error,
    loadBeneficios,
    clearBeneficiosError,
  };
};
