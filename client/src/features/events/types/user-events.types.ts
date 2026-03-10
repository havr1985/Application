import type { TagType } from '../../tags/types/tags.types.ts';

export type UserEvent = {
  id: string;
  title: string;
  dateTime: Date;
  tags: TagType[];
};
