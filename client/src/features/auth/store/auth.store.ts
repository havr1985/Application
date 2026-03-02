import type { User } from '../../../shared/types/user.type.ts';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { authApi } from '../api/auth.api.ts';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage.ts';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  accessToken: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => Promise<void>;
  setAccessToken: (token: string | null) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => {
      console.log('auth store init');
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
        accessToken: null,

        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            const data = await authApi.login({ email, password });
            set({
              user: data.user,
              accessToken: data.accessToken,
              isAuthenticated: true,
            });
          } catch (e) {
            const message = getErrorMessage(e) || 'Login failed';
            set({ isLoading: false, error: message });
            throw e;
          } finally {
            set({ isLoading: false });
          }
        },
        register: async (name, email, password) => {
          try {
            set({ isLoading: true, error: null });
            const data = await authApi.register({ name, email, password });
            set({
              user: data.user,
              accessToken: data.accessToken,
              isAuthenticated: true,
            });
          } catch (e) {
            const message = getErrorMessage(e) || 'Register failed';
            set({ isLoading: false, error: message });
            throw e;
          } finally {
            set({ isLoading: false });
          }
        },
        logout: async () => {
          try {
            await authApi.logout();
          } finally {
            set({ isAuthenticated: false, user: null });
          }
        },
        checkAuth: async () => {
          try {
            set({ isLoading: true });
            const { accessToken, user } = await authApi.refresh();
            set({ accessToken, user, isAuthenticated: true });
          } catch {
            set({ user: null, accessToken: null, isAuthenticated: false });
          } finally {
            set({ isLoading: false });
          }
        },
        clearError: () => set({ error: null }),
        setAccessToken: (token: string | null) => {
          set({ accessToken: token });
        },
      };
    },
    { name: 'auth-store', enabled: true },
  ),
);
