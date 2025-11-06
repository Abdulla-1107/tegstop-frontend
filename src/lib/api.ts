import axios from 'axios';
import type { LoginCredentials, LoginResponse, SearchParams, Record, CreateRecordData } from '@/types';

// Configure your backend API URL here
const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getMe: async (): Promise<{ user: any }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Records APIs
export const recordsAPI = {
  search: async (params: SearchParams): Promise<Record | null> => {
    const { data } = await api.get<Record | null>('/records/search', { params });
    return data;
  },
  
  getMyRecords: async (): Promise<Record[]> => {
    const { data } = await api.get<Record[]>('/records/my');
    return data;
  },
  
  create: async (recordData: CreateRecordData): Promise<Record> => {
    const { data } = await api.post<Record>('/records', recordData);
    return data;
  },
};

export default api;
