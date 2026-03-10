import type { Meta, StoryObj } from '@storybook/react-vite';
import { EventActionButton } from './EventActionButton';

const meta: Meta<typeof EventActionButton> = {
  title: 'UI/EventActionButton',
  component: EventActionButton,
};
export default meta;

type Story = StoryObj<typeof EventActionButton>;

export const Join: Story = {
  args: {
    isJoined: false,
    isFull: false,
    onJoin: () => console.log('join'),
    onLeave: () => console.log('leave'),
  },
};

export const Leave: Story = {
  args: {
    isJoined: true,
    isFull: false,
    onJoin: () => console.log('join'),
    onLeave: () => console.log('leave'),
  },
};

export const Full: Story = {
  args: {
    isJoined: false,
    isFull: true,
    onJoin: () => console.log('join'),
    onLeave: () => console.log('leave'),
  },
};
