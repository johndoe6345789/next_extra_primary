import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@shared/m3';

const meta: Meta<typeof Button> = {
  title: 'M3/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Button>;

/** Filled (primary) variant */
export const Filled: Story = {
  args: { variant: 'filled', children: 'Filled' },
};

/** Outlined variant */
export const Outlined: Story = {
  args: { variant: 'outlined', children: 'Outlined' },
};

/** Tonal (secondary) variant */
export const Tonal: Story = {
  args: { variant: 'tonal', children: 'Tonal' },
};

/** Elevated variant */
export const Elevated: Story = {
  args: { variant: 'elevated', children: 'Elevated' },
};

/** Text variant */
export const Text: Story = {
  args: { variant: 'text', children: 'Text' },
};

/** Small size */
export const Small: Story = {
  args: { variant: 'filled', size: 'sm', children: 'Small' },
};

/** Large size */
export const Large: Story = {
  args: { variant: 'filled', size: 'lg', children: 'Large' },
};

/** Error color */
export const ErrorColor: Story = {
  args: { variant: 'filled', color: 'error', children: 'Delete' },
};

/** With start icon */
export const WithStartIcon: Story = {
  args: {
    variant: 'filled',
    startIcon: <span>+</span>,
    children: 'Add Item',
  },
};

/** With end icon */
export const WithEndIcon: Story = {
  args: {
    variant: 'outlined',
    endIcon: <span>&rarr;</span>,
    children: 'Next',
  },
};

/** Loading state */
export const Loading: Story = {
  args: { variant: 'filled', loading: true, children: 'Saving...' },
};

/** Disabled state */
export const Disabled: Story = {
  args: { variant: 'filled', disabled: true, children: 'Disabled' },
};

/** Full width */
export const FullWidth: Story = {
  args: { variant: 'filled', fullWidth: true, children: 'Full Width' },
};
