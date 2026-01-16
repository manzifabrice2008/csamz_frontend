// Authentication utility functions

export const AUTH_TOKEN_KEY = 'authToken';
export const USER_KEY = 'user';
export const ADMIN_USER_KEY = 'adminUser';

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role: 'admin' | 'super_admin';
}

// Get auth token
export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

// Remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Get user data
export const getUser = (): AuthUser | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// Set user data
export const setUser = (user: AuthUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(ADMIN_USER_KEY, user.email);
};

// Remove user data
export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Login
export const login = (token: string, user: AuthUser): void => {
  setAuthToken(token);
  setUser(user);
};

// Logout
export const logout = (): void => {
  removeAuthToken();
  removeUser();
};

// Get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};
