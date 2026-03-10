export interface ToolArgs {
  dateFrom?: string;
  dateTo?: string;
  tag?: string;
  eventName?: string;
}

export interface AiEvent {
  title: string;
  date: Date;
  location: string;
  tags: string[];
  organizer: string;
  isOrganizer: boolean;
}
