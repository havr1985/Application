import { format } from 'date-fns';

export const formatDate = (date: string | Date) =>
  format(new Date(date), 'MMM dd, yyyy');

export const formatTime = (date: string | Date) =>
  format(new Date(date), 'HH:mm');

export const formatDateTime = (date: string | Date) =>
  format(new Date(date), 'MMM dd, yyyy . HH:mm');
