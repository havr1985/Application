import { useTagsStore } from './tags.store.ts';

export const useTags = () => useTagsStore((state) => state.tags);
