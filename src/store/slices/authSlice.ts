import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Usuario, AuthState, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, SocialLoginRequest } from '../../types';
import { authService } from '../../services';
import { mapBackendUserToFrontend } from '../../utils/userMapper';

// Async thunks
export const loginUser = createAsyncThunk<LoginResponse, LoginRequest>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error de login');
    }
  }
);

export const registerUser = createAsyncThunk<RegisterResponse, RegisterRequest>(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error de registro');
    }
  }
);

export const socialLogin = createAsyncThunk<LoginResponse, SocialLoginRequest>(
  'auth/socialLogin',
  async (socialData, { rejectWithValue }) => {
    try {
      const response = await authService.socialLogin(socialData);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error de login social');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error de logout');
    }
  }
);

export const getCurrentUser = createAsyncThunk<Usuario>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await authService.getUserData();
      if (!userData) {
        return rejectWithValue('No se pudo obtener datos del usuario');
      }
      return userData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al obtener usuario');
    }
  }
);

export const checkAuthStatus = createAsyncThunk<boolean>(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const isAuthenticated = await authService.isAuthenticated();
      return isAuthenticated;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al verificar autenticación');
    }
  }
);

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Helper interface for auth response
interface AuthResponse {
  token: string;
  user: Usuario;
  fetched_from_api: boolean;
  refreshed: boolean;
}

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<Usuario>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearSession: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.user) {
          state.user = mapBackendUserToFrontend(action.payload.data.user);
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.user) {
          state.user = mapBackendUserToFrontend(action.payload.data.user);
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Social Login
      .addCase(socialLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(socialLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data?.user) {
          state.user = mapBackendUserToFrontend(action.payload.data.user);
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(socialLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.user = null;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError, setUser, clearSession } = authSlice.actions;
export default authSlice.reducer;
