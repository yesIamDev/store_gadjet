// Normaliser l'URL de l'API (enlever le slash final si présent)
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
export const API_BASE_URL = rawApiUrl.endsWith('/')
  ? rawApiUrl.slice(0, -1)
  : rawApiUrl

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ARTICLES: {
    BASE: '/articles',
    BY_ID: (id: string) => `/articles/${id}`,
  },
  STOCK_MOVEMENTS: {
    BASE: '/stock-movements',
    BY_ID: (id: string) => `/stock-movements/${id}`,
    BY_ARTICLE: (articleId: string) => `/stock-movements?articleId=${articleId}`,
  },
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
  },
  INVOICES: {
    BASE: '/invoices',
    BY_ID: (id: string) => `/invoices/${id}`,
  },
  PENDING_ARTICLES: {
    BASE: '/pending-articles',
    BY_ID: (id: string) => `/pending-articles/${id}`,
    RECEIVE: (id: string) => `/pending-articles/${id}/receive`,
  },
} as const
