import type { TagType } from '../types/tags.types.ts';
import { api } from '../../../shared/api/axios.ts';

export const tagsApi = {
  getAllTags: async (): Promise<TagType[]> => {
    const res = await api.get('/tags');
    return res.data.data;
  },
};
