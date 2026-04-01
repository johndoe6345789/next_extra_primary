import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle } from '@shared/m3';

const meta: Meta<typeof Alert> = {
  title: 'M3/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Alert>;

/** Info severity (default) */
export const Info: Story = {
  args: { severity: 'info', children: 'Informational message.' },
};

/** Success severity */
export const Success: Story = {
  args: { severity: 'success', children: 'Operation succeeded.' },
};

/** Warning severity */
export const Warning: Story = {
  args: { severity: 'warning', children: 'Proceed with caution.' },
};

/** Error severity */
export const Error: Story = {
  args: { severity: 'error', children: 'Something went wrong.' },
};

/** With title */
export const WithTitle: Story = {
  render: () => (
    <Alert severity="info" title="Heads up">
      This alert has a title and description.
    </Alert>
  ),
};

/** Filled variant */
export const FilledVariant: Story = {
  args: {
    severity: 'success',
    variant: 'filled',
    children: 'Filled success alert.',
  },
};

/** Outlined variant */
export const OutlinedVariant: Story = {
  args: {
    severity: 'warning',
    variant: 'outlined',
    children: 'Outlined warning alert.',
  },
};

/** With close action */
export const Closable: Story = {
  render: () => (
    <Alert
      severity="error"
      onClose={() => alert('closed')}
    >
      This alert can be dismissed.
    </Alert>
  ),
};

/** With custom action */
export const WithAction: Story = {
  render: () => (
    <Alert
      severity="info"
      action={
        <button style={{ textDecoration: 'underline' }}>
          Undo
        </button>
      }
    >
      File moved to trash.
    </Alert>
  ),
};
