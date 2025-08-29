// Base API configuration
const API_BASE_URL = __DEV__ ? '/api' : 'https://api.clubvillamitre.com/api';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = await this.getAuthToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      if (__DEV__) {
        console.log(`🌐 API Request: ${config.method} ${url}`);
      }
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (__DEV__) {
          console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (__DEV__) {
        console.log(`✅ API Response: ${config.method} ${url}`, data);
      }
      return data;
    } catch (error) {
      if (__DEV__) {
        console.error('💥 API request failed:', error);
      }
      throw error;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    // In a real app, this would get the token from AsyncStorage
    // For now, return null since Mirage doesn't need real auth
    return null;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
