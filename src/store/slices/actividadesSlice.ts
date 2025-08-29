import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Actividad, BaseListState } from '../../types';
import { actividadesService } from '../../services';

// Async thunks
export const fetchActividades = createAsyncThunk<Actividad[]>(
  'actividades/fetchActividades',
  async (_, { rejectWithValue }) => {
    try {
      if (__DEV__) {
        console.log('🔄 Redux: fetchActividades thunk started');
      }
      const actividades = await actividadesService.getAll();
      if (__DEV__) {
        console.log('✅ Redux: fetchActividades received data:', actividades ? actividades.length : 0, 'items');
        if (actividades && actividades.length > 0) {
          console.log('📋 Redux: First actividad:', actividades[0].titulo);
        } else {
          console.log('📋 Redux: No actividades received');
        }
      }
      return actividades;
    } catch (error) {
      if (__DEV__) {
        console.error('❌ Redux: fetchActividades failed:', error);
      }
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar actividades');
    }
  }
);

export const fetchActividadById = createAsyncThunk<Actividad, string>(
  'actividades/fetchActividadById',
  async (id, { rejectWithValue }) => {
    try {
      const actividad = await actividadesService.getById(id);
      return actividad;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Error al cargar actividad');
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
const actividadesSlice = createSlice({
  name: 'actividades',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all actividades
      .addCase(fetchActividades.pending, (state) => {
        if (__DEV__) {
          console.log('⏳ Redux: fetchActividades.pending - setting loading=true');
        }
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActividades.fulfilled, (state, action) => {
        const payload = action.payload || [];
        if (__DEV__) {
          console.log('✅ Redux: fetchActividades.fulfilled - received', payload.length, 'actividades');
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
      .addCase(fetchActividades.rejected, (state, action) => {
        if (__DEV__) {
          console.error('❌ Redux: fetchActividades.rejected - error:', action.payload);
        }
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch actividad by id
      .addCase(fetchActividadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActividadById.fulfilled, (state, action) => {
        state.loading = false;
        // Update existing item or add new one
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
        state.error = null;
      })
      .addCase(fetchActividadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = actividadesSlice.actions;
export default actividadesSlice.reducer;
