import type { Meta, StoryObj } from '@storybook/react-vite';
import { DeleteEventModal } from './DeleteEventModal';

const meta: Meta<typeof DeleteEventModal> = {
  title: 'UI/DeleteEventModal',
  component: DeleteEventModal,
};
export default meta;

type Story = StoryObj<typeof DeleteEventModal>;

export const Default: Story = {
  args: {
    onClose: () => console.log('close'),
    onConfirm: () => console.log('confirm'),
  },
};
