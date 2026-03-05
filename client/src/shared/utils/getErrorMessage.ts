import { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message?.[0];
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Something went wrong';
};
