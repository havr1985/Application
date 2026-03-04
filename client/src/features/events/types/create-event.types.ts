export type CreateEventType = {
  title: string;
  description: string;
  dateTime: Date;
  location: string;
  capacity: number | null;
  visibility: string;
};

export type UpdateEventType = {
  title?: string;
  description?: string;
  dateTime?: Date;
  location?: string;
  capacity?: number | null;
  visibility?: string;
};
