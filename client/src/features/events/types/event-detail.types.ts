export type EventDetail = {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  visibility: 'private' | 'public';
  organizer: OrganizerDetail;
  participants: ParticipantsDetail[];
};

export type OrganizerDetail = {
  id: string;
  name: string;
  email: string;
};

export type ParticipantsDetail = {
  id: string;
  name: string;
};
