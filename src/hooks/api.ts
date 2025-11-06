import axios from "axios";

// Axios instance
export const api = axios.create({
  baseURL: "https://uyx.saparboy.uz/",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: har so‘rovda token qo‘shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Login function
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("user/login", data);
  return response.data; // { token: "..." }
};
