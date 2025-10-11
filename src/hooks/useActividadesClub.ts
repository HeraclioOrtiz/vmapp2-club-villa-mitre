import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { fetchActividadesClub, clearError } from '../store/slices/actividadesClubSlice';

export const useActividadesClub = () => {
  const dispatch = useAppDispatch();
  const { items: actividades, loading, error } = useAppSelector((state) => state.actividadesClub);
  const hasLoadedRef = useRef(false);

  if (__DEV__) {
    console.log('🎣 useActividadesClub: Hook called with state:', {
      actividades: actividades.length,
      loading,
      error: !!error,
      hasLoaded: hasLoadedRef.current
    });
  }

  const loadActividadesClub = useCallback(() => {
    if (__DEV__) {
      console.log('🔄 useActividadesClub: loadActividadesClub called');
    }
    return dispatch(fetchActividadesClub());
  }, [dispatch]);

  const clearActividadesClubError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Load actividades del club only once on mount
  useEffect(() => {
    if (!hasLoadedRef.current && !loading) {
      if (__DEV__) {
        console.log('🔄 useActividadesClub: Loading actividades del club on mount...');
      }
      hasLoadedRef.current = true;
      loadActividadesClub();
    }
  }, [loadActividadesClub, loading]);

  return {
    actividades,
    loading,
    error,
    loadActividadesClub,
    clearActividadesClubError,
  };
};
