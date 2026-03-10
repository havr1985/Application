import type { FC } from 'react';
import {
  type EventFormData,
  eventSchema,
} from '../../schemas/event.schemas.ts';
import { Controller, type Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { TagMultiSelect } from '../../../tags/components/TagMultiSelect.tsx';

interface EventFormProps {
  initialData?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  submitLabel: string;
  minCapacity?: number;
}

export const EventForm: FC<EventFormProps> = ({
  initialData,
  onSubmit,
  submitLabel,
  minCapacity,
}: EventFormProps) => {
  const navigate = useNavigate();
  const schema = eventSchema(minCapacity);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<EventFormData>({
    resolver: yupResolver(schema) as Resolver<EventFormData>,
    mode: 'onChange',
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      location: initialData?.location ?? '',
      capacity: initialData?.capacity ?? null,
      visibility: initialData?.visibility ?? 'public',
      dateTime: initialData?.dateTime ?? undefined,
      tagIds: initialData?.tagIds ?? [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="title"
          className="text-sm font-medium text-text-primary"
        >
          Event Title <span className="text-danger-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g., Tech Conference 2025"
          className="input-field"
          {...register('title')}
        />
        {errors.title && (
          <p className="text-xs text-danger-500">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="description"
          className="text-sm font-medium text-text-primary"
        >
          Description <span className="text-danger-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe what makes your event special..."
          className="input-field resize-y"
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-danger-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-text-primary">
            Date <span className="text-danger-500">*</span>
          </label>
          <Controller
            control={control}
            name="dateTime"
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date: unknown) => field.onChange(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd.MM.yyyy HH:mm"
                minDate={new Date()}
                placeholderText="dd.mm.yyyy --:--"
                className="input-field w-full"
                calendarClassName="event-datepicker"
              />
            )}
          />
          {errors.dateTime && (
            <p className="text-xs text-danger-500">{errors.dateTime.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="location"
            className="text-sm font-medium text-text-primary"
          >
            Location <span className="text-danger-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g., Convention Center, San Francisco"
            className="input-field"
            {...register('location')}
          />
          {errors.location && (
            <p className="text-xs text-danger-500">{errors.location.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="capacity"
          className="text-sm font-medium text-text-primary"
        >
          Capacity (optional)
        </label>
        <input
          id="capacity"
          type="number"
          min={minCapacity ?? 1}
          placeholder="Leave empty for unlimited"
          className="input-field"
          {...register('capacity')}
        />
        <p className="text-xs text-text-tertiary">
          Maximum number of participants. Leave empty for unlimited capacity.
        </p>
        {errors.capacity && (
          <p className="text-xs text-danger-500">{errors.capacity.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-text-primary">
          Visibility
        </label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-border p-4 has-[:checked]:border-accent-500 has-[:checked]:bg-accent-50 transition-colors">
            <input
              type="radio"
              value="public"
              className="h-4 w-4 accent-accent-500"
              {...register('visibility')}
            />
            <div>
              <p className="text-sm font-medium text-text-primary">Public</p>
              <p className="text-xs text-text-tertiary">
                Anyone can see and join this event
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-border p-4 has-[:checked]:border-accent-500 has-[:checked]:bg-accent-50 transition-colors">
            <input
              type="radio"
              value="private"
              className="h-4 w-4 accent-accent-500"
              {...register('visibility')}
            />
            <div>
              <p className="text-sm font-medium text-text-primary">Private</p>
              <p className="text-xs text-text-tertiary">
                Only invited people can see this event
              </p>
            </div>
          </label>
        </div>
        {errors.visibility && (
          <p className="text-xs text-danger-500">{errors.visibility.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-text-primary mb-2">
          Tags (optional, max 5)
        </label>
        <Controller
          control={control}
          name="tagIds"
          render={({ field }) => (
            <TagMultiSelect
              selected={field.value || []}
              onChange={field.onChange}
            />
          )}
        />
        {errors.tagIds && (
          <p className="text-xs text-danger-500">{errors.tagIds.message}</p>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="btn-outline flex-1"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="btn-primary flex-1"
        >
          {isSubmitting ? 'Processing...' : `${submitLabel}`}
        </button>
      </div>
    </form>
  );
};
