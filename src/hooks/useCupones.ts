import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  fetchCupones, 
  fetchCuponById, 
  setCategoriaSeleccionada, 
  clearCategoriaSeleccionada,
  clearError 
} from '../store/slices/cuponesSlice';

export const useCupones = () => {
  const dispatch = useAppDispatch();
  const { items: cupones, categoriaSeleccionada, loading, error } = useAppSelector((state) => state.cupones);

  const loadCupones = useCallback(() => {
    return dispatch(fetchCupones());
  }, [dispatch]);

  const loadCuponById = useCallback(
    (id: string) => {
      return dispatch(fetchCuponById(id));
    },
    [dispatch]
  );

  const selectCategoria = useCallback(
    (categoria: string | null) => {
      dispatch(setCategoriaSeleccionada(categoria));
    },
    [dispatch]
  );

  const clearCategoria = useCallback(() => {
    dispatch(clearCategoriaSeleccionada());
  }, [dispatch]);

  const clearCuponesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Filter cupones by selected category
  const cuponesFiltrados = categoriaSeleccionada
    ? cupones.filter(cupon => cupon.categoria === categoriaSeleccionada)
    : cupones;

  // Auto-load cupones on mount if not already loaded
  useEffect(() => {
    if (cupones.length === 0 && !loading && !error) {
      loadCupones();
    }
  }, [cupones.length, loading, error, loadCupones]);

  return {
    cupones,
    cuponesFiltrados,
    categoriaSeleccionada,
    loading,
    error,
    loadCupones,
    loadCuponById,
    selectCategoria,
    clearCategoria,
    clearCuponesError,
  };
};
