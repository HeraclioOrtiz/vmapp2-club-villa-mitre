import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl, shouldUseMirageServer } from '../utils/environment';

// Base API configuration
const API_BASE_URL = shouldUseMirageServer() ? '/api' : getApiBaseUrl();

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
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      console.log('📋 Request config:', {
        url,
        method: config.method || 'GET',
        headers: config.headers,
        bodyLength: config.body && typeof config.body === 'string' ? config.body.length : 0,
        bodyPreview: config.body && typeof config.body === 'string' ? config.body.substring(0, 200) + '...' : 'No body'
      });
      
      // Log exact body content for debugging
      if (config.body && typeof config.body === 'string') {
        console.log('📄 Request body (full):', config.body);
        console.log('📊 Body analysis:', {
          length: config.body.length,
          firstChar: config.body.charAt(0),
          lastChar: config.body.charAt(config.body.length - 1),
          containsQuotes: config.body.includes('"'),
          containsBackslash: config.body.includes('\\'),
          isValidJSON: (() => {
            try {
              JSON.parse(config.body as string);
              return true;
            } catch {
              return false;
            }
          })()
        });
      }
      
      const response = await fetch(url, config);
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} ${response.statusText}`);
        
        // Handle different error responses
        let errorMessage = `HTTP error! status: ${response.status}`;
        let validationErrors = null;
        
        try {
          const errorData = await response.json();
          console.error('❌ Error response data:', errorData);
          console.error('🔍 Error data type:', typeof errorData);
          console.error('🔍 Error data keys:', Object.keys(errorData));
          
          // Log errors object specifically
          if (errorData.errors) {
            console.error('📋 Validation errors object:', JSON.stringify(errorData.errors, null, 2));
            validationErrors = errorData.errors;
          }
          
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          if (errorData.errors) {
            // Laravel validation errors
            const errors = Object.values(errorData.errors).flat();
            console.error('📝 Formatted errors:', errors);
            if (errors.length > 0) {
              errorMessage = errors.join('\n');
            }
          }
        } catch (e) {
          console.error('❌ Could not parse error response as JSON', e);
        }
        
        const error: any = new Error(errorMessage);
        error.validationErrors = validationErrors;
        error.statusCode = response.status;
        throw error;
      }

      const data = await response.json();
      console.log('✅ API Response data:', data);
      return data;
      
    } catch (error) {
      console.error('💥 API request failed:', error);
      
      // Detailed error logging
      if (error instanceof Error) {
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }
      
      // Network error details
      if (error && typeof error === 'object' && 'code' in error) {
        console.error('🔍 Network error code:', (error as any).code);
      }
      
      // Check if it's a TypeError (common for network issues)
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        console.error('🌐 Network connectivity issue detected');
        console.error('🔍 Possible causes:');
        console.error('  - Server is down or unreachable');
        console.error('  - DNS resolution failed');
        console.error('  - Firewall blocking request');
        console.error('  - CORS issues');
        console.error('  - SSL/TLS certificate problems');
      }
      
      throw error;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Get token from AsyncStorage for real backend integration
      if (shouldUseMirageServer()) {
        // For Mirage server, return null (no auth needed)
        return null;
      }
      
      const token = await AsyncStorage.getItem('auth_token');
      return token;
    } catch (error) {
      if (__DEV__) {
        console.error('Error getting auth token from AsyncStorage:', error);
      }
      return null;
    }
  }

  // Token management methods
  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
      if (__DEV__) {
        console.log('🔐 Token saved to AsyncStorage');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error saving auth token to AsyncStorage:', error);
      }
      throw error;
    }
  }

  async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
      if (__DEV__) {
        console.log('🔐 Token removed from AsyncStorage');
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Error removing auth token from AsyncStorage:', error);
      }
      throw error;
    }
  }

  async hasAuthToken(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token !== null;
    } catch (error) {
      if (__DEV__) {
        console.error('Error checking auth token:', error);
      }
      return false;
    }
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
