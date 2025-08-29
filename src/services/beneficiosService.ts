import { apiClient } from './api';
import { Beneficio } from '../types';

export class BeneficiosService {
  async getAll(): Promise<Beneficio[]> {
    if (__DEV__) {
      console.log('🔄 BeneficiosService: getAll() called');
    }
    try {
      const result = await apiClient.get<Beneficio[]>('/beneficios');
      if (__DEV__) {
        console.log('✅ BeneficiosService: getAll() returned', result.length, 'beneficios');
      }
      return result;
    } catch (error) {
      if (__DEV__) {
        console.error('❌ BeneficiosService: getAll() failed:', error);
      }
      throw error;
    }
  }
}

export const beneficiosService = new BeneficiosService();
