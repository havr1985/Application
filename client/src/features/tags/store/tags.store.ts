import type { TagType } from '../types/tags.types.ts';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { tagsApi } from '../api/tags.api.ts';
import toast from 'react-hot-toast';
import { getErrorMessage } from '../../../shared/utils/getErrorMessage.ts';

interface TagsState {
  tags: TagType[] | [];

  fetchTags: () => Promise<TagType[]>;
}

export const useTagsStore = create<TagsState>()(
  devtools((set) => {
    console.log('tags store init');

    return {
      tags: [],

      fetchTags: async () => {
        try {
          const data = await tagsApi.getAllTags();
          set({ tags: data });
        } catch (e) {
          toast.error(getErrorMessage(e) || 'Fetch tags failed');
          throw e;
        }
      },
    };
  }),
);
