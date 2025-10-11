import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { EstadoCuenta } from '../../types';
import { estadoCuentaService } from '../../services/estadoCuentaService';

// Estado inicial
interface EstadoCuentaState {
  data: EstadoCuenta | null;
  loading: boolean;
  error: string | null;
}

const initialState: EstadoCuentaState = {
  data: null,
  loading: false,
  error: null,
};

// Thunks asíncronos
export const fetchEstadoCuenta = createAsyncThunk(
  'estadoCuenta/fetchEstadoCuenta',
  async (_, { rejectWithValue }) => {
    try {
      const data = await estadoCuentaService.getEstadoCuenta();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

export const cambiarUsuarioTesting = createAsyncThunk(
  'estadoCuenta/cambiarUsuario',
  async (alDia: boolean, { rejectWithValue }) => {
    try {
      const response = await estadoCuentaService.cambiarUsuario(alDia);
      return response.user.estadoCuenta;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error desconocido');
    }
  }
);

// Slice
const estadoCuentaSlice = createSlice({
  name: 'estadoCuenta',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetEstadoCuenta: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchEstadoCuenta
      .addCase(fetchEstadoCuenta.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEstadoCuenta.fulfilled, (state, action: PayloadAction<EstadoCuenta>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchEstadoCuenta.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // cambiarUsuarioTesting
      .addCase(cambiarUsuarioTesting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cambiarUsuarioTesting.fulfilled, (state, action: PayloadAction<EstadoCuenta>) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(cambiarUsuarioTesting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetEstadoCuenta } = estadoCuentaSlice.actions;
export default estadoCuentaSlice.reducer;
