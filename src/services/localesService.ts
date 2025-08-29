import { apiClient } from './api';
import { Local } from '../types';

export class LocalesService {
  async getAll(): Promise<Local[]> {
    return apiClient.get<Local[]>('/locales');
  }
}

export const localesService = new LocalesService();
