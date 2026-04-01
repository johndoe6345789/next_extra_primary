import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from '@shared/m3';

const meta: Meta<typeof Chip> = {
  title: 'M3/Chip',
  component: Chip,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Chip>;

/** Default filled chip */
export const Default: Story = {
  args: { label: 'Default' },
};

/** Outlined variant */
export const Outlined: Story = {
  args: { label: 'Outlined', variant: 'outlined' },
};

/** Primary color */
export const Primary: Story = {
  args: { label: 'Primary', color: 'primary' },
};

/** Success color */
export const Success: Story = {
  args: { label: 'Success', color: 'success' },
};

/** Error color */
export const ErrorChip: Story = {
  args: { label: 'Error', color: 'error' },
};

/** Warning color */
export const WarningChip: Story = {
  args: { label: 'Warning', color: 'warning' },
};

/** Small size */
export const Small: Story = {
  args: { label: 'Small', size: 'small' },
};

/** Clickable chip */
export const Clickable: Story = {
  args: { label: 'Clickable', clickable: true },
};

/** Deletable chip with handler */
export const Deletable: Story = {
  args: {
    label: 'Remove me',
    onDelete: () => alert('deleted'),
  },
};

/** With leading icon */
export const WithIcon: Story = {
  args: {
    label: 'Star',
    icon: <span>&#9733;</span>,
  },
};

/** Disabled chip */
export const Disabled: Story = {
  args: { label: 'Disabled', disabled: true },
};

/** Outlined deletable with icon */
export const OutlinedWithIconDelete: Story = {
  args: {
    label: 'Tag',
    variant: 'outlined',
    icon: <span>#</span>,
    onDelete: () => alert('deleted'),
  },
};
