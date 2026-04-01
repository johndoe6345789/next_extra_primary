import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from '@shared/m3';

const meta: Meta<typeof TextField> = {
  title: 'M3/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof TextField>;

/** Default text field */
export const Default: Story = {
  args: { label: 'Name', placeholder: 'Enter name' },
};

/** With helper text */
export const WithHelperText: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    helperText: 'We will never share your email.',
  },
};

/** Error state */
export const ErrorState: Story = {
  args: {
    label: 'Password',
    type: 'password',
    error: true,
    helperText: 'Password is required.',
  },
};

/** Small size */
export const SmallSize: Story = {
  args: {
    label: 'Search',
    size: 'small',
    placeholder: 'Quick search...',
  },
};

/** Disabled */
export const Disabled: Story = {
  args: {
    label: 'Locked',
    disabled: true,
    value: 'Cannot edit',
  },
};

/** Required field */
export const Required: Story = {
  args: {
    label: 'Username',
    required: true,
    placeholder: 'Required field',
  },
};

/** Number type */
export const NumberInput: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
  },
};
