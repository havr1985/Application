import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { EventForm } from './EventForm';
import { useTagsStore } from '../../../tags/store/tags.store';

const mockTags = [
  { id: '1', name: 'Tech' },
  { id: '2', name: 'Art' },
  { id: '3', name: 'Business' },
  { id: '4', name: 'Music' },
  { id: '5', name: 'Design' },
];

const meta: Meta<typeof EventForm> = {
  title: 'Forms/EventForm',
  component: EventForm,
  decorators: [
    (Story) => {
      useTagsStore.setState({ tags: mockTags });
      return (
        <MemoryRouter>
          <div className="mx-auto max-w-2xl p-8">
            <Story />
          </div>
        </MemoryRouter>
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof EventForm>;

export const Create: Story = {
  args: {
    onSubmit: async (data) => console.log('Create:', data),
    submitLabel: 'Create Event',
  },
};

export const Edit: Story = {
  args: {
    initialData: {
      title: 'Tech Conference 2026',
      description: 'Annual technology conference featuring AI innovations.',
      dateTime: new Date('2026-04-15T09:00:00'),
      location: 'Convention Center, San Francisco',
      capacity: 500,
      visibility: 'public' as const,
      tagIds: ['1', '2'],
    },
    onSubmit: async (data) => console.log('Update:', data),
    submitLabel: 'Save Changes',
    minCapacity: 3,
  },
};
