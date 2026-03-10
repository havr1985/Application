import { api } from '../../../shared/api/axios.ts';

export const aiApi = {
  ask: async (question: string): Promise<{ answer: string }> => {
    const res = await api.post('/ai/ask', { question });
    return res.data.data;
  },
};
