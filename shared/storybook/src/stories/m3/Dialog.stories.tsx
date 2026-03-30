import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions,
  Button, TextField,
} from '@metabuilder/m3';

const meta: Meta<typeof Dialog> = {
  title: 'M3/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof Dialog>;

const useToggle = () => {
  const [open, set] = useState(false);
  return { open, show: () => set(true), hide: () => set(false) };
};

/** Basic dialog with title and text */
export const Basic: Story = {
  render: () => {
    const { open, show, hide } = useToggle();
    return (<>
      <Button variant="filled" onClick={show}>Open</Button>
      <Dialog open={open} onClose={hide}>
        <DialogTitle>Basic Dialog</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is a basic dialog example.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={hide}>Close</Button>
        </DialogActions>
      </Dialog>
    </>);
  },
};

/** Dialog with form inputs */
export const WithForm: Story = {
  render: () => {
    const { open, show, hide } = useToggle();
    return (<>
      <Button variant="filled" onClick={show}>Edit</Button>
      <Dialog open={open} onClose={hide}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField label="Name" />
          <TextField label="Email" type="email" />
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={hide}>Cancel</Button>
          <Button variant="filled" onClick={hide}>Save</Button>
        </DialogActions>
      </Dialog>
    </>);
  },
};

/** Confirmation dialog pattern */
export const Confirmation: Story = {
  render: () => {
    const { open, show, hide } = useToggle();
    return (<>
      <Button variant="filled" color="error" onClick={show}>
        Delete Item
      </Button>
      <Dialog open={open} onClose={hide}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={hide}>Cancel</Button>
          <Button variant="filled" color="error" onClick={hide}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>);
  },
};
