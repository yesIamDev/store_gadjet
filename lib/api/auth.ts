import { apiClient } from './client'
import { API_ENDPOINTS } from './config'
import type { AuthResponse, LoginDto, RegisterDto } from './types'

export const authApi = {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    )
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    
    return response
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },

  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  },

  getStoredUser() {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },
}
