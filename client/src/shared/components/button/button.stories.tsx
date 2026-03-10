// shared/components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'accent', 'outline', 'danger', 'full'],
    },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Join Event', variant: 'primary' },
};

export const Accent: Story = {
  args: { children: '+ Create Event', variant: 'accent' },
};

export const Outline: Story = {
  args: { children: 'Cancel', variant: 'outline' },
};

export const Danger: Story = {
  args: { children: 'Delete', variant: 'danger' },
};

export const Full: Story = {
  args: { children: 'Event is Full', variant: 'full', disabled: true },
};

export const Disabled: Story = {
  args: { children: 'Join Event', variant: 'primary', disabled: true },
};

export const FullWidth: Story = {
  args: { children: 'Join Event', variant: 'primary', fullWidth: true },
};
