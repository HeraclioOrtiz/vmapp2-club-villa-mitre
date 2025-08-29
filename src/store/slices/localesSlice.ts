import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BaseListState, Local } from '../../types';
import { localesService } from '../../services';

// Async thunks
export const fetchLocales = createAsyncThunk<Local[]>(
  'locales/fetchLocales',
  async (_, { rejectWithValue }) => {
    try {
      const locales = await localesService.getAll();
      return locales;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar locales');
    }
  }
);

// Initial state
const initialState: BaseListState<Local> = {
  items: [],
  loading: false,
  error: null,
};

// Slice
const localesSlice = createSlice({
  name: 'locales',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocales.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchLocales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = localesSlice.actions;
export default localesSlice.reducer;
