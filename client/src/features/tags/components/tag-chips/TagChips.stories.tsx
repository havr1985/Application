import type { Meta, StoryObj } from '@storybook/react-vite';
import { TagChips } from './TagChips';

const meta: Meta<typeof TagChips> = {
  title: 'UI/TagChips',
  component: TagChips,
};
export default meta;

type Story = StoryObj<typeof TagChips>;

export const MultipleTags: Story = {
  args: {
    tags: [
      { id: '1', name: 'Tech' },
      { id: '2', name: 'Design' },
      { id: '3', name: 'Networking' },
    ],
  },
};

export const SingleTag: Story = {
  args: {
    tags: [{ id: '1', name: 'Music' }],
  },
};

export const Empty: Story = {
  args: { tags: [] },
};
