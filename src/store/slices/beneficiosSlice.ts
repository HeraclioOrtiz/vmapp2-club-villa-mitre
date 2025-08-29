import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Beneficio, BaseListState } from '../../types';
import { beneficiosService } from '../../services';

// Async thunks
export const fetchBeneficios = createAsyncThunk<Beneficio[]>(
  'beneficios/fetchBeneficios',
  async (_, { rejectWithValue }) => {
    try {
      const beneficios = await beneficiosService.getAll();
      return beneficios;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar beneficios');
    }
  }
);

// Initial state
const initialState: BaseListState<Beneficio> = {
  items: [],
  loading: false,
  error: null,
};

// Slice
const beneficiosSlice = createSlice({
  name: 'beneficios',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBeneficios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficios.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBeneficios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = beneficiosSlice.actions;
export default beneficiosSlice.reducer;
