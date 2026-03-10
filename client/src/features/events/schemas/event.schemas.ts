import * as yup from 'yup';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

export const eventSchema = (minCapacity: number = 1) =>
  yup.object({
    title: yup
      .string()
      .max(100, 'Title must be at most 100 characters')
      .required('Title is required'),
    description: yup.string().required('Description is required'),
    dateTime: yup
      .date()
      .min(tomorrow, 'Event must start from tomorrow or later')
      .required('Date and time are required'),
    location: yup
      .string()
      .max(200, 'Location must be at most 200 characters')
      .required('Location is required'),
    capacity: yup
      .number()
      .nullable()
      .optional()
      .transform((value, original) => (original === '' ? null : value))
      .min(minCapacity, `Cannot be less than ${minCapacity} participants`),
    visibility: yup
      .string()
      .oneOf(['public', 'private'])
      .required('Visibility is required'),
    tagIds: yup
      .array()
      .of(yup.string().required())
      .max(5, 'Maximum 5 tags per event')
      .optional()
      .default([]),
  });

export type EventFormData = yup.InferType<ReturnType<typeof eventSchema>>;
