import api from '@/constants/api';
import { useMutation, useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

const register = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post('auth/register', { json: credentials }).json<User>();
  if (response) {
    window.location.reload();
  }
  return response;
};

const login = async (credentials: LoginCredentials): Promise<User> => {
  const response = await api.post('auth/login', { json: credentials }).json<User>();
  if (response) {
    window.location.reload();
  }
  return response;
};

const logout = async (): Promise<void> => {
  await api.post('auth/logout').json();
  window.location.reload();
};

const checkAuthStatus = async (): Promise<User> => {
  return await api.get('auth/status').json<User>();
};

const refreshToken = async (): Promise<void> => {
  await api.post('auth/refresh').json();
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
  });
};

export const useCheckAuthStatus = () => {
  return useQuery({
    queryKey: ['auth', 'status'],
    queryFn: checkAuthStatus,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: refreshToken,
    retry: 3
  });
};

export { checkAuthStatus, login, logout, refreshToken, register };
