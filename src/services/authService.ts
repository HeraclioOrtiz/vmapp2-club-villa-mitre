import { apiClient } from './api';
import { Usuario, LoginRequest, LoginResponse } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  }

  async logout(): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>('/auth/logout');
  }

  async getCurrentUser(): Promise<Usuario> {
    return apiClient.get<Usuario>('/auth/me');
  }
}

export const authService = new AuthService();
