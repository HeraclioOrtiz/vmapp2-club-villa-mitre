import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { loginUser, logoutUser, getCurrentUser, clearError } from '../store/slices/authSlice';
import { LoginRequest } from '../types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const login = useCallback(
    (credentials: LoginRequest) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    return dispatch(logoutUser());
  }, [dispatch]);

  const checkAuth = useCallback(() => {
    return dispatch(getCurrentUser());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
    clearAuthError,
  };
};
