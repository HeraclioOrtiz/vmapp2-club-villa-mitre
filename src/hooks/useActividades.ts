import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchActividades, fetchActividadById, clearError } from '../store/slices/actividadesSlice';

export const useActividadesUsuario = () => {
  const dispatch = useAppDispatch();
  const { items: actividades, loading, error } = useAppSelector((state) => state.actividades);
  const hasLoadedRef = useRef(false);

  if (__DEV__) {
    console.log('🎣 useActividadesUsuario: Hook called with state:', {
      actividades: actividades.length,
      loading,
      error: !!error,
      hasLoaded: hasLoadedRef.current
    });
  }

  const loadActividades = useCallback(() => {
    if (__DEV__) {
      console.log('🔄 useActividadesUsuario: loadActividades called');
    }
    return dispatch(fetchActividades());
  }, [dispatch]);

  const loadActividadById = useCallback(
    (id: string) => {
      return dispatch(fetchActividadById(id));
    },
    [dispatch]
  );

  const clearActividadesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Load actividades only once on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !loading) {
      if (__DEV__) {
        console.log('🔄 useActividadesUsuario: Loading actividades on mount...');
      }
      hasLoadedRef.current = true;
      loadActividades();
    }
  }, [loadActividades, loading]);

  return {
    actividades,
    loading,
    error,
    loadActividades,
    loadActividadById,
    clearActividadesError,
  };
};
