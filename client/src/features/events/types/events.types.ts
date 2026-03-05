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
};

export type Participant = {
  id: string;
};

export type Organizer = {
  id: string;
  name: string;
};
