import { useAuthStore } from './auth.store.ts';

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
export const useAuthActions = () => {
  const store = useAuthStore.getState();
  return {
    login: store.login,
    register: store.register,
    logout: store.logout,
    checkAuth: store.checkAuth,
    setAccessToken: store.setAccessToken,
  };
};
