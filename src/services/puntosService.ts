import { apiClient } from './api';
import { PuntosData } from '../types';

export class PuntosService {
  async getPuntos(): Promise<PuntosData> {
    return apiClient.get<PuntosData>('/puntos');
  }

  async canjearPuntos(puntosACanjear: number): Promise<{ success: boolean; nuevoPuntaje: number }> {
    return apiClient.post<{ success: boolean; nuevoPuntaje: number }>('/puntos/canjear', {
      puntosACanjear,
    });
  }
}

export const puntosService = new PuntosService();
