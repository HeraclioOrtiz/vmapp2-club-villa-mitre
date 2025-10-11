import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Actividad, BaseListState } from '../../types';
import { actividadesClubService } from '../../services';

// Async thunks
export const fetchActividadesClub = createAsyncThunk<Actividad[]>(
  'actividadesClub/fetchActividadesClub',
  async (_, { rejectWithValue }) => {
    try {
      if (__DEV__) {
        console.log('🔄 Redux: fetchActividadesClub thunk started');
      }
      const actividades = await actividadesClubService.getAll();
      if (__DEV__) {
        console.log('✅ Redux: fetchActividadesClub received data:', actividades ? actividades.length : 0, 'items');
        if (actividades && actividades.length > 0) {
          console.log('📋 Redux: First actividad del club:', actividades[0].titulo);
        } else {
          console.log('📋 Redux: No actividades del club received');
        }
      }
      return actividades;
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Redux: fetchActividadesClub failed:', error);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar actividades del club');
    }
  }
);

// Initial state
const initialState: BaseListState<Actividad> = {
  items: [],
  loading: false,
  error: null,
};

// Slice
const actividadesClubSlice = createSlice({
  name: 'actividadesClub',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all actividades del club
      .addCase(fetchActividadesClub.pending, (state) => {
        if (__DEV__) {
          console.log('⏳ Redux: fetchActividadesClub.pending - setting loading=true');
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActividadesClub.fulfilled, (state, action) => {
        const payload = action.payload || [];
        if (__DEV__) {
          console.log('✅ Redux: fetchActividadesClub.fulfilled - received', payload.length, 'actividades del club');
          if (payload.length > 0) {
            console.log('📊 Redux: Setting state.items to:', payload.map(a => a.titulo || 'Sin título'));
          } else {
            console.log('📊 Redux: Setting state.items to empty array');
          }
        }
        state.loading = false;
        state.items = payload;
        state.error = null;
      })
      .addCase(fetchActividadesClub.rejected, (state, action) => {
        if (__DEV__) {
          console.error('❌ Redux: fetchActividadesClub.rejected - error:', action.payload);
        }
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = actividadesClubSlice.actions;
export default actividadesClubSlice.reducer;
