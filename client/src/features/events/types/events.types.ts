import type { TagType } from '../../tags/types/tags.types.ts';

export type EventsItem = {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  participantCount: number;
  organizer: Organizer;
  participants: Participant[];
  tags: TagType[];
};

export type Participant = {
  id: string;
};

export type Organizer = {
  id: string;
  name: string;
};
