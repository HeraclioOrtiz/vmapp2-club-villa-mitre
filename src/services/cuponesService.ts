import { apiClient } from './api';
import { Cupon, CategoriasCupon } from '../types';

export class CuponesService {
  async getAll(): Promise<Cupon[]> {
    return apiClient.get<Cupon[]>('/cupones');
  }

  async getById(id: string): Promise<Cupon> {
    return apiClient.get<Cupon>(`/cupones/${id}`);
  }

  async getCategorias(): Promise<CategoriasCupon[]> {
    return apiClient.get<CategoriasCupon[]>('/cupones/categorias');
  }
}

export const cuponesService = new CuponesService();
