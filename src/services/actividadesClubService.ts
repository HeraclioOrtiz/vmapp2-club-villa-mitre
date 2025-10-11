import { apiClient } from './api';
import { Actividad } from '../types';

export class ActividadesClubService {
  async getAll(): Promise<Actividad[]> {
    if (__DEV__) {
      console.log('🔄 ActividadesClubService: getAll() called');
    }
    try {
      const result = await apiClient.get<Actividad[]>('/actividades-club');
      if (__DEV__) {
        console.log('✅ ActividadesClubService: getAll() returned', result.length, 'actividades del club');
      }
      return result;
    } catch (error) {
      if (__DEV__) {
        console.error('❌ ActividadesClubService: getAll() failed:', error);
      }
      throw error;
    }
  }
}

export const actividadesClubService = new ActividadesClubService();
