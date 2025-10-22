import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { 
  loginUser, 
  registerUser, 
  socialLogin, 
  logoutUser, 
  getCurrentUser, 
  clearError, 
  clearSession 
} from '../store/slices/authSlice';
import { LoginRequest, RegisterRequest, SocialLoginRequest } from '../types';

// Podés tiparlo mejor si tenés la interfaz real de Usuario
type AnyUser = {
  id?: number | string;
  name?: string;
  user_type?: string;
  type_label?: string;
  token?: string;
  access_token?: string;
  [k: string]: any;
} | null;

type UseAuthReturn = {
  user: AnyUser;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null; // <-- NUEVO
  login: (credentials: LoginRequest) => any;
  register: (userData: RegisterRequest) => any;
  loginWithSocial: (socialData: SocialLoginRequest) => any;
  logout: () => Promise<void>;
  checkAuth: () => any;
  clearAuthError: () => void;
};

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();

  // Lo tomo como any para no pelearme con el tipo del slice si no tiene 'token'
  const authState: any = useAppSelector((state) => state.auth);
  const { user, isAuthenticated, loading, error } = authState as {
    user: AnyUser;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  };

  // Fallbacks comunes para token:
  const token = useMemo<string | null>(() => {
    const raw =
      authState?.token ??
      authState?.accessToken ??
      (user as any)?.token ??
      (user as any)?.access_token ??
      null;
    return typeof raw === 'string' ? raw : null;
  }, [authState?.token, authState?.accessToken, user]);

  if (__DEV__ && user) {
    console.log('🔐 useAuth - Usuario actual:', {
      id: user?.id,
      name: user?.name,
      user_type: user?.user_type,
      type_label: user?.type_label,
      hasToken: !!token,
    });
  }

  const login = useCallback(
    (credentials: LoginRequest) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData: RegisterRequest) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const loginWithSocial = useCallback(
    (socialData: SocialLoginRequest) => dispatch(socialLogin(socialData)),
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearSession());
    } catch (error) {
      // Si falla el logout del servidor, limpiar sesión local de todas formas
      dispatch(clearSession());
      throw error;
    }
  }, [dispatch]);

  const checkAuth = useCallback(() => dispatch(getCurrentUser()), [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    token,              // <-- lo exponemos
    login,
    register,
    loginWithSocial,
    logout,
    checkAuth,
    clearAuthError,
  };
};
