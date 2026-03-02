import { api } from '../../../shared/api/axios.ts';

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post('auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post('auth/login', data);
    return res.data;
  },
  logout: async () => {
    const res = await api.post('auth/logout');
    return res.data;
  },

  refresh: async () => {
    const res = await api.post('auth/refresh');
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('users/me');
    return res.data;
  },
};
