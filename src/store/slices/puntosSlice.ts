import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PuntosState, PuntosData } from '../../types';
import { puntosService } from '../../services';

// Async thunks
export const fetchPuntos = createAsyncThunk<PuntosData>(
  'puntos/fetchPuntos',
  async (_, { rejectWithValue }) => {
    try {
      const puntos = await puntosService.getPuntos();
      return puntos;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar puntos');
    }
  }
);

export const canjearPuntos = createAsyncThunk<{ success: boolean; nuevoPuntaje: number }, number>(
  'puntos/canjearPuntos',
  async (puntosACanjear, { rejectWithValue }) => {
    try {
      const result = await puntosService.canjearPuntos(puntosACanjear);
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al canjear puntos');
    }
  }
);

// Initial state
const initialState: PuntosState = {
  data: null,
  loading: false,
  error: null,
};

// Slice
const puntosSlice = createSlice({
  name: 'puntos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch puntos
      .addCase(fetchPuntos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPuntos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchPuntos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Canjear puntos
      .addCase(canjearPuntos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(canjearPuntos.fulfilled, (state, action) => {
        state.loading = false;
        if (state.data) {
          state.data.puntosTotales = action.payload.nuevoPuntaje;
        }
        state.error = null;
      })
      .addCase(canjearPuntos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = puntosSlice.actions;
export default puntosSlice.reducer;
