import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Slices
import authReducer from './slices/authSlice';
import actividadesReducer from './slices/actividadesSlice';
import beneficiosReducer from './slices/beneficiosSlice';
import cuponesReducer from './slices/cuponesSlice';
import puntosReducer from './slices/puntosSlice';
import localesReducer from './slices/localesSlice';

// Types
import { RootState } from '../types';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Solo persistir auth por ahora
};

// Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  actividades: actividadesReducer,
  beneficios: beneficiosReducer,
  cupones: cuponesReducer,
  puntos: puntosReducer,
  locales: localesReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store configuration
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      }
    }),
  devTools: process.env.NODE_ENV !== 'production', // Solo en desarrollo
});

export const persistor = persistStore(store);

// Types
export type AppDispatch = typeof store.dispatch;
export type { RootState };

// Selectors helpers
export const selectAuth = (state: RootState) => state.auth;
export const selectActividades = (state: RootState) => state.actividades;
export const selectBeneficios = (state: RootState) => state.beneficios;
export const selectCupones = (state: RootState) => state.cupones;
export const selectPuntos = (state: RootState) => state.puntos;
export const selectLocales = (state: RootState) => state.locales;
